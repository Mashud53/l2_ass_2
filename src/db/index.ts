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
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      role VARCHAR(20) ,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `)

    console.log("database connected");

  } catch (error) {
    console.log(error);
  }
}