const pool = require("../config/db");

const getTicketCategoriesByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await pool.query(
      `SELECT * FROM ticket_categories 
       WHERE match_id = $1 
       ORDER BY price ASC`,
      [matchId]
    );

    res.json({
      success: true,
      ticketCategories: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket categories",
      error: error.message,
    });
  }
};

const createTicketCategory = async (req, res) => {
  try {
    const { match_id, name, price, total_quantity, available_quantity } =
      req.body;

    if (!match_id || !name || !price || !total_quantity || !available_quantity) {
      return res.status(400).json({
        success: false,
        message: "All ticket category fields are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO ticket_categories 
        (match_id, name, price, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [match_id, name, price, total_quantity, available_quantity]
    );

    res.status(201).json({
      success: true,
      message: "Ticket category created successfully",
      ticketCategory: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ticket category",
      error: error.message,
    });
  }
};

module.exports = {
  getTicketCategoriesByMatch,
  createTicketCategory,
};