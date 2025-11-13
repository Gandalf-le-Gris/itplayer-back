require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const { authRoutes } = require("./routes/auth");
const { playlistRoutes } = require("./routes/playlists");
const { youtubeRoutes } = require("./routes/youtube");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/youtube", youtubeRoutes);

app.get("/", (req, res) => {
  res.send("Pong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
