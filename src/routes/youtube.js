const express = require("express");
const router = express.Router();
const youtubeService = require("../services/youtube.ts").default;
const { execa } = require("execa");

router.get("/search", async (req, res) => {
  try {
    res.json(await youtubeService.search(req.query.query));
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

router.get("/play", async (req, res) => {
  try {
    const { audioFormat, stream } = await youtubeService.getAudioStream(req.query.videoId);
    res.setHeader('Content-Type', audioFormat.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="audio.${audioFormat.mime_type.split('/')[1]}"`);
    res.pipe(stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

module.exports = { youtubeRoutes: router };
