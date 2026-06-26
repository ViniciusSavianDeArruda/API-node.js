import * as z from "zod";

// schema para atualização de usuário — todos os campos são opcionais
// permite atualizar só o nome sem precisar mandar email e senha
export const updateUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional()
});
