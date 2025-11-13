const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDao = require("../db/user");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "error.required.generic" });

    const existing = await userDao.existsByUsername(username);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "error.user.user-already-exists" });

    const hash = await bcrypt.hash(password, 10);
    await userDao.save(username, hash);

    res.status(201).json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "error.required.generic" });

    const result = await userDao.findByUsername(username);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "error.user.wrong-credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "error.user.wrong-credentials" });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, username FROM users WHERE id=$1", [
      req.user.userId,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

module.exports = router;