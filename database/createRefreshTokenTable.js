import "dotenv/config";
import { pool } from "../config/db.js";

const createRefreshTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log("Tabela refresh_tokens criada com sucesso");
  await pool.end();
};

createRefreshTable();
