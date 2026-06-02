const express = require("express");
const {
  getStadiums,
  createStadium,
} = require("../controllers/stadiumController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getStadiums);
router.post("/", protect, adminOnly, createStadium);

module.exports = router;