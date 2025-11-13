const express = require("express");
const router = express.Router();
const youtubeService = require("../services/youtube.ts").default;

router.get("/search", async (req, res) => {
  try {
    res.json(await youtubeService.search(req.query.query));
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

module.exports = { youtubeRoutes: router };
