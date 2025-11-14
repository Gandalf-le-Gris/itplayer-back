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
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send('error.required.generic');
  }
  try {
    res.setHeader('Content-Type', 'audio/webm');
    const ytdlp = execa('yt-dlp', [
      '-f', 'bestaudio',
      '-o', '-',
      'https://www.youtube.com/watch?v=' + videoUrl
    ]);
    ytdlp.stdout.pipe(res);
    ytdlp.on('error', (err) => {
      console.error('yt-dlp error:', err);
      res.end();
    });
    ytdlp.on('exit', (code) => {
      if (code !== 0) console.error(`yt-dlp exited with code ${code}`);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

module.exports = { youtubeRoutes: router };
