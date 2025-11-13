const pool = require("./db");

class UserDao {
  async existsByUsername(username) {
    return pool.query("SELECT * FROM users WHERE username=$1", [username]);
  }

  async save(username, hash) {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hash,
    ]);
  }

  async findByUsername(username) {
    return pool.query("SELECT * FROM users WHERE username=$1", [username]);
  }
}

module.exports = new UserDao();
