const pool = require("../config/db");

const getStadiums = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stadiums ORDER BY id ASC");

    res.json({
      success: true,
      stadiums: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stadiums",
      error: error.message,
    });
  }
};

const createStadium = async (req, res) => {
  try {
    const { name, city, capacity } = req.body;

    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: "Stadium name and city are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO stadiums (name, city, capacity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, city, capacity]
    );

    res.status(201).json({
      success: true,
      message: "Stadium created successfully",
      stadium: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create stadium",
      error: error.message,
    });
  }
};

module.exports = {
  getStadiums,
  createStadium,
};