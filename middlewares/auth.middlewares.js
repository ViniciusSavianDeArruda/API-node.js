import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  // pegar authorization header
  const authHeader = req.headers.authorization;

  // verificar se token existe
  if (!authHeader) {

    return res.status(401).json({
      message: "Token não informado"
    });
  }

  // pegar somente token
  const token = authHeader.split(" ")[1];

  try {

    // validar token
    jwt.verify(token, process.env.JWT_SECRET);

    // continuar rota
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Token inválido"
    });
  }
};
