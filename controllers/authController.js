import jwt from "jsonwebtoken";

// função de login
export const login = (req, res) => {

  const { email, password } = req.body;

  // Verificar email e senha
  if (email !== "admin@gmail.com" || password !== "123456") {

    return res.status(401).json({
      message: "Email ou senha inválidos"
    });
  }

  // gerar token
  const token = jwt.sign(
    {
      email
    },

    "secret-key",

    {
      expiresIn: "1d"
    }
  );

  // devolver token
  return res.json({
    token
  });
};