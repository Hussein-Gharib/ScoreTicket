const express = require("express");
const { getTeams, createTeam } = require("../controllers/teamController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getTeams);
router.post("/", protect, adminOnly, createTeam);

module.exports = router;