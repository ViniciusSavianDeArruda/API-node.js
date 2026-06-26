// middleware de validação — executa o schema do Zod antes de chegar no controller
export const validateSchema = (schema) => (req, res, next) => {
  // safeParse não lança exceção — retorna { success, data } ou { success, error }
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // mapeia os erros do Zod para um formato mais legível
    const errors = result.error.issues.map(e => ({
      field: e.path.join("."),  // nome do campo que falhou
      message: e.message        // mensagem de erro definida no schema
    }));

    return res.status(400).json({
      status: "erro",
      message: "Dados inválidos. Verifique os campos e tente novamente.",
      errors
    });
  }

  // validação passou — continua para o controller
  next();
};
