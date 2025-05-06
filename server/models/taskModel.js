const pool = require("../config/db");

class Task {
  static async create(taskData) {
    const { title, description, status } = taskData;

    const [result] = await pool.query(
      `INSERT INTO task (title, description, status)
       VALUES (?, ?, ?)`,
      [title, description, status]
    );

    return result.insertId;
  }

  static async update(id, updatedData) {
    const { status, completedBy } = updatedData;

    const [result] = await pool.query(
      `UPDATE task SET status = ?, completedBy = ?
       WHERE id = ?`,
      [status, completedBy, id]
    );

    return result;
  }

  static async getAll() {
    const query = "SELECT * FROM task ORDER BY created_at DESC";
    const [rows] = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM task WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async delete(id) {
    const [result] = await pool.query("DELETE FROM task WHERE id = ?", [id]);
    return result;
  }
}

module.exports = Task;
