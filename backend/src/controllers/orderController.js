const pool = require("../config/db");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { match_id, ticket_category_id, quantity } = req.body;

    if (!match_id || !ticket_category_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Match, ticket category, and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const categoryResult = await pool.query(
      "SELECT * FROM ticket_categories WHERE id = $1 AND match_id = $2",
      [ticket_category_id, match_id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket category not found for this match",
      });
    }

    const category = categoryResult.rows[0];

    if (category.available_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough tickets available",
      });
    }

    const totalPrice = Number(category.price) * Number(quantity);

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, match_id, total_price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, match_id, totalPrice]
    );

    const order = orderResult.rows[0];

    await pool.query(
      `INSERT INTO order_items 
        (order_id, ticket_category_id, quantity, price_each)
       VALUES ($1, $2, $3, $4)`,
      [order.id, ticket_category_id, quantity, category.price]
    );

    await pool.query(
      `UPDATE ticket_categories
       SET available_quantity = available_quantity - $1
       WHERE id = $2`,
      [quantity, ticket_category_id]
    );

    const createdTickets = [];

    for (let i = 0; i < quantity; i++) {
      const ticketCode = `ST-${order.id}-${Date.now()}-${i + 1}`;

      const ticketResult = await pool.query(
        `INSERT INTO tickets 
          (order_id, user_id, match_id, ticket_code)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [order.id, userId, match_id, ticketCode]
      );

      createdTickets.push(ticketResult.rows[0]);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      tickets: createdTickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        tickets.id,
        tickets.ticket_code,
        tickets.status,
        tickets.created_at,
        matches.league,
        matches.match_date,
        home_team.name AS home_team,
        away_team.name AS away_team,
        stadiums.name AS stadium_name,
        stadiums.city AS stadium_city
      FROM tickets
      JOIN matches ON tickets.match_id = matches.id
      JOIN teams AS home_team ON matches.home_team_id = home_team.id
      JOIN teams AS away_team ON matches.away_team_id = away_team.id
      JOIN stadiums ON matches.stadium_id = stadiums.id
      WHERE tickets.user_id = $1
      ORDER BY tickets.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      tickets: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyTickets,
};