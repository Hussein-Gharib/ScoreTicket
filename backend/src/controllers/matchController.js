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
      JOIN teams AS home_team ON matches.home_team_id = home_team.id
      JOIN teams AS away_team ON matches.away_team_id = away_team.id
      JOIN stadiums ON matches.stadium_id = stadiums.id
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
    const { home_team_id, away_team_id, stadium_id, league, match_date } =
      req.body;

    if (!home_team_id || !away_team_id || !stadium_id || !league || !match_date) {
      return res.status(400).json({
        success: false,
        message: "All match fields are required",
      });
    }

    if (home_team_id === away_team_id) {
      return res.status(400).json({
        success: false,
        message: "Home team and away team cannot be the same",
      });
    }

    const result = await pool.query(
      `INSERT INTO matches 
        (home_team_id, away_team_id, stadium_id, league, match_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [home_team_id, away_team_id, stadium_id, league, match_date]
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

module.exports = {
  getMatches,
  createMatch,
};