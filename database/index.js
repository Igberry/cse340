const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing
 * But will cause problems in production
 * *************** */
let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Added for debugging queries in development mode
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("Executed query:", { text });
        return res;
      } catch (error) {
        console.error("Error in query:", { text, error });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

// Ensure `pool` is always exported
module.exports = pool;
