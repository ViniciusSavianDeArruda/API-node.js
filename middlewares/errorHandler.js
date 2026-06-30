// errorHandler faz com que o servidor retorne uma resposta de erro padronizada para o cliente, com o status e a mensagem de erro apropriados. Isso ajuda a manter a consistência na forma como os erros são tratados e comunicados ao cliente.
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor";

  return res.status(status).json({
    status: "erro",
    message
  });
};
