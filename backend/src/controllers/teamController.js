const pool = require("../config/db");

const getTeams = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teams ORDER BY id ASC");

    res.json({
      success: true,
      teams: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
      error: error.message,
    });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, logo_url } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO teams (name, logo_url)
       VALUES ($1, $2)
       RETURNING *`,
      [name, logo_url]
    );

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create team",
      error: error.message,
    });
  }
};

module.exports = {
  getTeams,
  createTeam,
};