import jwt from "jsonwebtoken";
import { users } from "../users.js";
import bcrypt from "bcrypt";

// função de login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. verificar se o usuário existe
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 2. verificar se a senha bate com o hash
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
