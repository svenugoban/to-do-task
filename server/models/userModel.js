const pool = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async register(connection, { username, email, password }) {
    if (!password) {
      throw new Error("Password is required for hashing.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      `INSERT INTO users (username, email, password, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
      [username, email, hashedPassword]
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }
}

module.exports = User;
