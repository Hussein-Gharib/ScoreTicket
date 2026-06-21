const express = require("express");

const {
  getLeagues,
  getLeagueMatches,
} = require("../controllers/leagueController");

const router = express.Router();

router.get("/", getLeagues);
router.get("/:leagueName/matches", getLeagueMatches);

module.exports = router;