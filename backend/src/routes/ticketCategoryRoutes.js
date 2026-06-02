const express = require("express");
const {
  getTicketCategoriesByMatch,
  createTicketCategory,
} = require("../controllers/ticketCategoryController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/match/:matchId", getTicketCategoriesByMatch);
router.post("/", protect, adminOnly, createTicketCategory);

module.exports = router;