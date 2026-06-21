const express = require("express");

const {
  getMatches,
  createMatch,
  deleteMatch,
} = require("../controllers/matchController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getMatches);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createMatch
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMatch
);

module.exports = router;