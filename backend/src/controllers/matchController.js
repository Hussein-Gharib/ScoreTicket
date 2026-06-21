const pool = require("../config/db");

const getMatches = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        matches.id,
        matches.league,
        matches.match_date,
        matches.created_at,
        home_team.name AS home_team,
        home_team.logo_url AS home_team_logo,
        away_team.name AS away_team,
        away_team.logo_url AS away_team_logo,
        stadiums.name AS stadium_name,
        stadiums.city AS stadium_city
      FROM matches
      JOIN teams AS home_team
        ON matches.home_team_id = home_team.id
      JOIN teams AS away_team
        ON matches.away_team_id = away_team.id
      JOIN stadiums
        ON matches.stadium_id = stadiums.id
      ORDER BY matches.match_date ASC
    `);

    res.json({
      success: true,
      matches: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch matches",
      error: error.message,
    });
  }
};

const createMatch = async (req, res) => {
  try {
    const {
      home_team_id,
      away_team_id,
      stadium_id,
      league,
      match_date,
    } = req.body;

    if (
      !home_team_id ||
      !away_team_id ||
      !stadium_id ||
      !league ||
      !match_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All match fields are required",
      });
    }

    const homeTeamId = Number(home_team_id);
    const awayTeamId = Number(away_team_id);
    const stadiumId = Number(stadium_id);

    if (
      Number.isNaN(homeTeamId) ||
      Number.isNaN(awayTeamId) ||
      Number.isNaN(stadiumId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Team and stadium IDs must be valid numbers",
      });
    }

    if (homeTeamId === awayTeamId) {
      return res.status(400).json({
        success: false,
        message: "Home team and away team cannot be the same",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO matches
          (
            home_team_id,
            away_team_id,
            stadium_id,
            league,
            match_date
          )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        homeTeamId,
        awayTeamId,
        stadiumId,
        league.trim(),
        match_date,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      match: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create match",
      error: error.message,
    });
  }
};

const deleteMatch = async (req, res) => {
  const client = await pool.connect();

  try {
    const matchId = Number(req.params.id);

    if (!Number.isInteger(matchId) || matchId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid match ID",
      });
    }

    await client.query("BEGIN");

    const matchResult = await client.query(
      `
        SELECT id
        FROM matches
        WHERE id = $1
      `,
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // Save the related order IDs before deleting their order items.
    const relatedOrdersResult = await client.query(
      `
        SELECT DISTINCT order_id
        FROM order_items
        WHERE ticket_category_id IN (
          SELECT id
          FROM ticket_categories
          WHERE match_id = $1
        )
      `,
      [matchId]
    );

    const relatedOrderIds = relatedOrdersResult.rows.map(
      (row) => row.order_id
    );

    // Delete every generated ticket belonging to this match.
    await client.query(
      `
        DELETE FROM tickets
        WHERE match_id = $1
      `,
      [matchId]
    );

    // Delete purchased ticket items connected to this match.
    await client.query(
      `
        DELETE FROM order_items
        WHERE ticket_category_id IN (
          SELECT id
          FROM ticket_categories
          WHERE match_id = $1
        )
      `,
      [matchId]
    );

    // Delete the match ticket categories.
    await client.query(
      `
        DELETE FROM ticket_categories
        WHERE match_id = $1
      `,
      [matchId]
    );

    // Delete the match itself.
    await client.query(
      `
        DELETE FROM matches
        WHERE id = $1
      `,
      [matchId]
    );

    // Delete only orders that became empty after removing this match.
    for (const orderId of relatedOrderIds) {
      const remainingOrderItems = await client.query(
        `
          SELECT id
          FROM order_items
          WHERE order_id = $1
          LIMIT 1
        `,
        [orderId]
      );

      if (remainingOrderItems.rows.length === 0) {
        await client.query(
          `
            DELETE FROM orders
            WHERE id = $1
          `,
          [orderId]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message:
        "Match and all ticket information connected to it were deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: "Failed to delete match",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getMatches,
  createMatch,
  deleteMatch,
};