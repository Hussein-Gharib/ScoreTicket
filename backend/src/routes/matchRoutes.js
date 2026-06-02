const express = require("express");
const { getMatches, createMatch } = require("../controllers/matchController");

const router = express.Router();

router.get("/", getMatches);
router.post("/", createMatch);

module.exports = router;