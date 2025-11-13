const pool = require("./db");

class PlaylistsDao {
  async findByOwner(ownerId) {
    return (await pool.query("SELECT * FROM playlists WHERE owner=$1", [ownerId])).rows;
  }
}

module.exports = new PlaylistsDao();
