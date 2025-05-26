const { Pool } = require("pg");
require("dotenv").config();

let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV !== "development" ? { rejectUnauthorized: false } : false,
});

const db = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params);
      if (process.env.NODE_ENV === "development") {
        console.log("Executed query:", { text });
      }
      return res;
    } catch (error) {
      console.error("Error in query:", { text, error });
      throw error;
    }
  },
};

module.exports = db;
