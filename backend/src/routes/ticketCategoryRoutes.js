const express = require("express");
const {
  getTicketCategoriesByMatch,
  createTicketCategory,
} = require("../controllers/ticketCategoryController");

const router = express.Router();

router.get("/match/:matchId", getTicketCategoriesByMatch);
router.post("/", createTicketCategory);

module.exports = router;