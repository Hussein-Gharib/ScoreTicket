const pool = require("../config/db");

const getLeagues = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        league,
        COUNT(*)::integer AS match_count,
        MIN(match_date) AS next_match_date
      FROM matches
      WHERE league IS NOT NULL
        AND TRIM(league) <> ''
      GROUP BY league
      ORDER BY league ASC
    `);

    res.json({
      success: true,
      leagues: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leagues",
      error: error.message,
    });
  }
};

const getLeagueMatches = async (req, res) => {
  try {
    const leagueName = decodeURIComponent(req.params.leagueName);

    const result = await pool.query(
      `
        SELECT
          matches.id,
          matches.league,
          matches.match_date,
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
        WHERE LOWER(matches.league) = LOWER($1)
        ORDER BY matches.match_date ASC
      `,
      [leagueName]
    );

    res.json({
      success: true,
      league: leagueName,
      matches: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch league matches",
      error: error.message,
    });
  }
};

module.exports = {
  getLeagues,
  getLeagueMatches,
};