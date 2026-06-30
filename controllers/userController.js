import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

// Buscar todos os usuários — não retorna a senha
export const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT id, name, email, created_at FROM users");
    return res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Criar usuário — gera hash da senha antes de salvar
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // transforma a senha em hash antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    return res.status(201).json(result.rows[0]); // 201 Created — não retorna a senha
  } catch (err) {
    next(err);
  }
}

// Atualizar usuário
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // id vem na URL: PUT /users/:id
    const { name, email, password } = req.body;

    // verifica se o usuário existe
    const existing = await pool.query("SELECT id FROM users WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // gera novo hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email",
      [name, email, hashedPassword, id]
    );

    return res.json(result.rows[0]); // não retorna a senha
  } catch (err) {
    next(err);
  }
}

// Deletar usuário
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; // id vem na URL: DELETE /users/:id

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.sendStatus(204); // 204 No Content — sem corpo na resposta
  } catch (err) {
    next(err);
  }
}
