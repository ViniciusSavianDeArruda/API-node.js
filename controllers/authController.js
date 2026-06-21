import jwt from "jsonwebtoken";
import { users } from "../users.js";

// função de login
export const login = (req, res) => {
  const {email, password } = req.body;

    const user = users.find(u => u.email === email);

  // Verificar email e senha
   if (!user || user.password !== password) {
    return res.status(401).json({ message: "Email ou senha inválidos" });
  }

  // gerar token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
  },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // devolver token
  return res.json({token});
};
