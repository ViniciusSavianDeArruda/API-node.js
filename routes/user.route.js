import { validateSchema } from "../middlewares/validate.js";
import { createUserSchema } from "../validators/userSchema.js";
import { updateUserSchema } from "../validators/updateUserSchema.js";
import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router(); // criando uma instância do Router do express

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Token não informado ou inválido
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cria um usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário removido
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Usuário não encontrado
 */

router.get("/", authMiddleware, getUsers);
router.post("/", validateSchema(createUserSchema), createUser);
router.put("/:id", authMiddleware, validateSchema(updateUserSchema), updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router

export default router;
