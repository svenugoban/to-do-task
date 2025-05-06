const pool = require("../config/db");

class Task {
  static async create(taskData) {
    const { title, description, status, completedBy } = taskData;

    const [result] = await pool.query(
      `INSERT INTO task (title, description, status, completedBy)
       VALUES (?, ?, ?, ?)`,
      [title, description, status, completedBy]
    );

    return result.insertId;
  }

  static async update(id, updatedData) {
    const { title, description, status, completedBy } = updatedData;

    const [result] = await pool.query(
      `UPDATE task SET title = ?, description = ?, status = ?, completedBy = ?
       WHERE id = ?`,
      [title, description, status, completedBy, id]
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
