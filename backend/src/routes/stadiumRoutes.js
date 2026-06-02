const express = require("express");
const {
  getStadiums,
  createStadium,
} = require("../controllers/stadiumController");

const router = express.Router();

router.get("/", getStadiums);
router.post("/", createStadium);

module.exports = router;