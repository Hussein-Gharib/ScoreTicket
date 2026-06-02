const express = require("express");
const {
  createOrder,
  getMyTickets,
} = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-tickets", protect, getMyTickets);

module.exports = router;