const fs = require("fs");
const path = require("path");
const pool = require("../config/db"); // Import the pool

//create the migration function
async function runMigration() {
  try {
    // Read SQL file
    const sqlFilePath = path.join(__dirname, "databasemigration.sql");
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8");

    // Connect to the database
    const connection = await pool.getConnection();

    // Execute the SQL query
    await connection.query(sqlQuery);
    console.log("Migration completed successfully!");

    // Close the connection
    await connection.end();
  } catch (error) {
    // console.error("Error running migration:", error);
  }
}

module.exports = runMigration;
