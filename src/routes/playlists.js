const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const playlistsDao = require("../db/playlists");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const data = await playlistsDao.findByOwner(req.user.userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

module.exports = { playlistRoutes: router };
