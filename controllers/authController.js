import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

// função de login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. busca o usuário pelo email no banco
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 2. verifica se a senha bate com o hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 3. gerar token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. devolver token
    return res.json({ token });
  } catch (err) {
    next(err); // passa o erro para o errorHandler
  }
};
