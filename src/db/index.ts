import { Pool } from "pg";
import config from "../config/env";

export const pool = new Pool({
  connectionString: config.connectionString ,
})

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT ,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);

       await pool.query(
      `
        CREATE TABLE IF NOT EXISTS issues(
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        type VARCHAR(20),
        status VARCHAR(20),
        reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()

        )
        `
    )

    console.log("database connected");

  } catch (error) {
    console.log(error);
  }
}