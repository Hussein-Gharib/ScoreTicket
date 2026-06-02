const express = require("express");
const { getMatches, createMatch } = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getMatches);
router.post("/", protect, adminOnly, createMatch);

module.exports = router;