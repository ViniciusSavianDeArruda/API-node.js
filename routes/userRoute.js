import {Router} from 'express';
import { authMiddleware } from "../middlewares/auth.middlewares.js";
// importando as funções do UserController para serem usadas nas rotas
import{
  getUsers,
  createUser,
  deleteUser
} from "../controllers/UserController.js";

const router = Router(); // criando uma instância do Router do express

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuários
 */

router.get("/",authMiddleware, getUsers);

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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

router.post("/", createUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário removido
 */

router.delete("/:id", deleteUser);

export default router;
