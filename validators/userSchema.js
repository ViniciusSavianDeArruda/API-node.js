import * as z from "zod";

// schema para criação de usuário — todos os campos são obrigatórios
export const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

// schema para login — só verifica se os campos foram enviados com formato válido
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória")
});
