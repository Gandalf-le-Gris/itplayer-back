require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Pong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
