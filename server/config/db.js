const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true, // Enable multiple sql query statements
  dateStrings: true,  // ← This line is the key!
});

// Test the connection and log the result
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully!");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Export the pool to use in other modules
module.exports = pool;
