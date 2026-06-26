# Estudando API REST com Express e Node.js

## Conceitos Fundamentais

### Rotas, Endpoints e Métodos HTTP

Toda API possui uma **rota**, um **endpoint** e um **método HTTP**.

- A **rota** é o caminho da URL, como `/users` ou `/users/1`
- O **endpoint** é a combinação do método HTTP com a rota, como `GET /users`
- O **método HTTP** define o tipo de operação que está sendo realizada

| Método   | Descrição                          |
|----------|------------------------------------|
| `GET`    | Buscar dados                       |
| `POST`   | Criar dados                        |
| `PUT`    | Atualizar dados                    |
| `PATCH`  | Atualizar dados parcialmente       |
| `DELETE` | Deletar dados                      |

---

### Request e Response

Toda comunicação em uma API funciona no modelo **cliente → servidor → cliente**.

| Conceito   | Descrição                                                         |
|------------|-------------------------------------------------------------------|
| `REQUEST`  | Requisição do **cliente para o servidor** (o que o cliente manda) |
| `RESPONSE` | Resposta do **servidor para o cliente** (o que você devolve)      |

No Express, esses dois objetos aparecem em toda rota como parâmetros `req` e `res`:

```javascript
router.get("/", (req, res) => {
  // req = o que o cliente mandou
  // res = o que você vai devolver
});
```

---

### Status Codes

Códigos de status indicam se uma requisição foi bem-sucedida ou se houve algum erro. São divididos em faixas:

- **2xx** — Sucesso
- **4xx** — Erro do cliente (requisição errada)
- **5xx** — Erro do servidor

| Código | Nome                  | Descrição                                                               |
|--------|-----------------------|-------------------------------------------------------------------------|
| `200`  | OK                    | Requisição bem-sucedida, o servidor processou e devolveu uma resposta   |
| `201`  | Created               | Um recurso foi criado com sucesso                                       |
| `204`  | No Content            | Requisição bem-sucedida, mas não há conteúdo para devolver              |
| `400`  | Bad Request           | A requisição do cliente não foi entendida pelo servidor                 |
| `401`  | Unauthorized          | O cliente não tem autorização para acessar o recurso                    |
| `403`  | Forbidden             | O cliente não tem permissão para acessar o recurso                      |
| `404`  | Not Found             | O recurso solicitado não foi encontrado no servidor                     |
| `500`  | Internal Server Error | Erro no servidor ao processar a requisição                              |

---

### Body e Params

Existem duas formas principais do cliente mandar informações para o servidor:

| Conceito | Onde fica        | Como acessar     | Exemplo de uso                        |
|----------|------------------|------------------|---------------------------------------|
| `body`   | Corpo da request | `req.body`       | Mandar nome e email ao criar usuário  |
| `params` | Na URL           | `req.params`     | Mandar o id na URL para deletar       |

```javascript
// params — o :id na rota vira req.params.id
router.delete("/:id", (req, res) => {
  const { id } = req.params; // ex: DELETE /users/3 → id = "3"
});

// body — os dados chegam no corpo da requisição em JSON
router.post("/", (req, res) => {
  const { name, email } = req.body; // ex: { "name": "João", "email": "joao@email.com" }
});
```

---

### Middleware

Middleware é uma função que fica **no meio** do caminho entre a requisição e a resposta. Ela pode modificar o `req`, o `res`, chamar o próximo middleware com `next()`, ou encerrar a requisição.

```javascript
app.use(express.json());
```

`express.json()` é um middleware nativo do Express que lê o corpo da requisição e converte o JSON em um objeto JavaScript antes de chegar no seu controller. Sem ele, `req.body` seria `undefined`.

Um middleware sempre recebe três parâmetros: `req`, `res` e `next`. O `next()` é uma função que diz ao Express para continuar para o próximo passo. Se você não chamar `next()`, a requisição fica parada.

```javascript
// Exemplo de middleware personalizado
const meuMiddleware = (req, res, next) => {
  console.log("Passou pelo middleware");
  next(); // continua para a rota
};
```

O `app.use()` serve para registrar middlewares e rotas no servidor. Tudo que passar por ali vai ser executado na ordem em que foi registrado.

---

### Callbacks e Arrow Functions

Um **callback** é uma função passada como argumento para outra função.

```javascript
// A função anônima passada para router.get é um callback
router.get("/", (req, res) => {
  res.json(users);
});
```

A sintaxe `(req, res) => {}` é uma **arrow function**, uma forma mais curta de escrever funções em JavaScript. É equivalente a:

```javascript
router.get("/", function(req, res) {
  res.json(users);
});
```

---

### Destructuring

O **destructuring** é uma forma de extrair valores de objetos ou arrays de forma mais limpa:

```javascript
// Sem destructuring
const name = req.body.name;
const email = req.body.email;

// Com destructuring
const { name, email } = req.body;
```

```javascript
// Sem destructuring
const id = req.params.id;

// Com destructuring
const { id } = req.params;
```

---

### Formas de enviar a resposta

O Express tem diferentes métodos no `res` para enviar a resposta:

| Método               | Quando usar                                              |
|----------------------|----------------------------------------------------------|
| `res.json()`         | Retornar dados em formato JSON (mais comum em APIs)      |
| `res.send()`         | Retornar texto simples ou HTML                           |
| `res.status()`       | Definir o status code antes de enviar (encadeável)       |
| `res.sendStatus()`   | Enviar apenas o status code, sem corpo                   |

```javascript
res.json(users);                    // 200 + dados em JSON
res.status(201).json(user);         // 201 + dados em JSON
res.sendStatus(204);                // 204 sem corpo
```

---

## Autenticação com JWT

### O que é JWT

**JWT** (JSON Web Token) é um padrão para transmitir informações de forma segura entre cliente e servidor. Ele é usado para autenticação: o cliente faz login, recebe um token, e manda esse token em todas as próximas requisições para provar que está autenticado.

Um token JWT tem três partes separadas por ponto:

```
header.payload.signature

eyJhbGciOiJIUzI1NiJ9 . eyJlbWFpbCI6ImFkbWluIn0 . xSKsNMJtR3sQBHc6F7...
     header                    payload                    signature
```

- **Header** — informa o algoritmo usado
- **Payload** — os dados que você colocou no token (como o email do usuário)
- **Signature** — garante que o token não foi alterado, gerada com o JWT_SECRET

O token **não é criptografado**, apenas assinado. Isso significa que qualquer um pode ler o payload, mas não pode alterar sem invalidar a assinatura. Nunca coloque senhas no payload.

---

### Fluxo de autenticação

```
1. Cliente manda email e senha para POST /auth/login
2. Servidor valida as credenciais
3. Servidor gera um token JWT e devolve para o cliente
4. Cliente guarda o token
5. Cliente manda o token no header Authorization em toda requisição protegida
6. Servidor valida o token antes de permitir o acesso
```

O header de autorização segue o padrão **Bearer Token**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

### try/catch

O `try/catch` é usado para lidar com erros que podem acontecer durante a execução. No caso do JWT, a função `jwt.verify()` lança um erro se o token for inválido, então usamos try/catch para capturar esse erro e devolver uma resposta adequada.

```javascript
try {
  // tenta executar esse bloco
  jwt.verify(token, process.env.JWT_SECRET);
  next(); // se chegou aqui, o token é válido
} catch (error) {
  // se der erro, cai aqui
  return res.status(401).json({ message: "Token inválido" });
}
```

---

## Variáveis de Ambiente

Dados sensíveis como a chave do JWT nunca devem ficar no código. Eles ficam em um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=minha_chave_secreta_super_segura
```

O pacote `dotenv` carrega esse arquivo e disponibiliza os valores em `process.env`:

```javascript
import "dotenv/config"; // carrega o .env no topo do server.js

jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
```

O arquivo `.env` está no `.gitignore` e **nunca deve ser enviado ao Git**.

---

## Estrutura do Projeto

```
projeto/
├── .env                             — variáveis de ambiente (não sobe no Git)
├── .gitignore
├── package.json
├── server.js                        — ponto de entrada, configura e inicia o servidor
├── users.js                         — array de usuários compartilhado entre controllers
├── routes/
│   ├── auth.route.js                — rota de login
│   └── user.route.js                — rotas de usuários
├── controllers/
│   ├── authController.js            — lógica de autenticação e geração do token
│   └── userController.js            — lógica de usuários (listar, criar, atualizar, deletar)
├── middlewares/
│   └── auth.middlewares.js          — valida o token JWT em rotas protegidas
└── docs/
    └── openapi.js                   — configuração do Swagger
```

### Endpoints disponíveis

| Método   | Rota            | Auth?   | Descrição                  |
|----------|-----------------|---------|----------------------------|
| `POST`   | `/auth/login`   | Não     | Gera um token JWT          |
| `GET`    | `/users`        | **Sim** | Lista todos os usuários    |
| `POST`   | `/users`        | Não     | Cria um novo usuário       |
| `PUT`    | `/users/:id`    | **Sim** | Atualiza um usuário        |
| `DELETE` | `/users/:id`    | **Sim** | Remove um usuário          |

### Fluxo completo de uma requisição

```
Cliente faz uma requisição
       ↓
  server.js  →  roteia para routes/
       ↓
  routes/    →  chama middleware (se a rota exigir)
       ↓
  middlewares/ → valida token, chama next()
       ↓
  controllers/ → processa e devolve a resposta
```

---

## Servidor Principal — `server.js`

```javascript
import "dotenv/config"; // carrega o .env
import express from "express";
import swaggerUi from "swagger-ui-express";
import specs from "./docs/openapi.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

// Middleware para ler JSON no corpo da requisição
app.use(express.json());

// Middleware para ler dados de formulário (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Rotas de autenticação — login não exige token
app.use("/auth", authRoutes);

// Rotas de usuários — algumas exigem token (definido dentro do arquivo de rotas)
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Api rodando com express");
});

// Documentação Swagger — acessível em http://localhost:3333/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
```

---

## Rotas de autenticação — `routes/auth.route.js`

```javascript
import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou senha inválidos
 */
router.post("/login", login);

export default router;
```

---

## Rotas de usuários — `routes/user.route.js`

O `authMiddleware` é passado como segundo argumento nas rotas que exigem autenticação (`GET`, `PUT` e `DELETE`). A rota `POST` é pública — qualquer pessoa pode criar uma conta sem precisar de token.

Cada rota tem um comentário `@openapi` que o `swagger-jsdoc` lê automaticamente para montar a documentação no Swagger. As rotas protegidas têm `security: - bearerAuth: []`, que faz o Swagger exibir o cadeado e o botão **Authorize** para informar o token.

```javascript
import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userController.js";

const router = Router();

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
router.get("/", authMiddleware, getUsers);

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
router.post("/", createUser);

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
router.delete("/:id", authMiddleware, deleteUser);

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
router.put("/:id", authMiddleware, updateUser);

export default router;
```

---

## Controller de autenticação — `controllers/authController.js`

O login busca o usuário pelo email, verifica se existe, e depois compara a senha digitada com o hash salvo usando `bcrypt.compare`. A função é `async` porque `bcrypt.compare` é assíncrono.

A verificação é feita em duas etapas separadas para evitar tentar acessar `user.password` quando o usuário não existe (o que quebraria o código).

```javascript
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { users } from "../users.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. verificar se o usuário existe
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Email ou senha inválidos" });
  }

  // 2. verificar se a senha bate com o hash — só depois de confirmar que o user existe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email ou senha inválidos" });
  }

  // 3. gerar token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 4. devolver token
  return res.json({ token });
};
```

---

## Middleware de autenticação — `middlewares/auth.middlewares.js`

Esse middleware é responsável por proteger as rotas. Ele intercepta a requisição, verifica se o token existe e se é válido, e só então deixa a requisição continuar com `next()`.

```javascript
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  // O token chega no header Authorization como: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;

  // Se não veio nenhum header, bloqueia
  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado"
    });
  }

  // authHeader = "Bearer eyJhbGci..."
  // split(" ") divide em ["Bearer", "eyJhbGci..."]
  // [1] pega só o token
  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next(); // token válido — continua para o controller
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido"
    });
  }
};
```

---

## Array de usuários compartilhado — `users.js`

O array `users` fica em um arquivo separado na raiz para ser importado tanto pelo `authController` quanto pelo `userController`. Sem isso, cada arquivo teria seu próprio array isolado — um usuário criado em um controller não existiria no outro.

```javascript
export const users = [];
```

---

## Controller de usuários — `controllers/userController.js`

Todas as funções que lidam com senha agora usam `bcrypt`. A senha nunca é retornada nas respostas — nem em texto puro nem como hash.

```javascript
import bcrypt from "bcrypt";
import { users } from "../users.js";

// Buscar todos os usuários — remove a senha de cada usuário antes de retornar
export const getUsers = (req, res) => {
  const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
  return res.json(usersWithoutPassword);
};

// Criar usuário — gera hash da senha antes de salvar
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // bcrypt.hash(senha, rounds) — quanto maior o número de rounds, mais seguro e mais lento
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword // armazena o hash, nunca a senha em texto puro
  };

  users.push(user);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email
  }); // 201 Created — não retorna a senha nem o hash
};

// Atualizar usuário — também gera hash se a senha for alterada
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const user = users.find(u => u.id == id);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.name = name;
  user.email = email;
  user.password = hashedPassword;

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email
  }); // não retorna a senha
};

// Deletar usuário
export const deleteUser = (req, res) => {
  const { id } = req.params;

  const index = users.findIndex(user => user.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  users.splice(index, 1);

  return res.sendStatus(204); // 204 No Content
};
```

---

## Documentação com OpenAPI/Swagger — `docs/openapi.js`

O **Swagger** permite visualizar e testar os endpoints da API pelo navegador, sem precisar de ferramentas como Insomnia ou Postman.

- `swagger-jsdoc` lê os comentários `@openapi` nos arquivos de rota e monta a documentação
- `swagger-ui-express` serve essa documentação como uma página web

Após iniciar o servidor, acesse: [http://localhost:3333/docs](http://localhost:3333/docs)

O `components.securitySchemes` define o esquema de autenticação Bearer JWT. Sem isso o Swagger não sabe que a API usa token — o botão **Authorize** não aparece e as rotas protegidas não mostram o cadeado. As rotas que precisam do token declaram `security: - bearerAuth: []` nas suas anotações `@openapi`.

```javascript
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Node Estudos",
      version: "1.0.0",
      description: "Documentação da API com OpenAPI",
    },
    servers: [
      {
        url: "http://localhost:3333",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // lê todos os arquivos de rota em busca de anotações @openapi
};

const specs = swaggerJsdoc(options);

export default specs;
```

---

## Validação com Zod

### O que é Zod

**Zod** é uma biblioteca de validação de dados. Você define o formato esperado de um objeto (schema) e o Zod verifica se os dados recebidos batem com esse formato antes de chegar no controller.

Sem validação, qualquer dado pode entrar na API — email sem `@`, senha vazia, campos faltando. Com Zod, você garante que os dados são válidos antes de processá-los.

### schemas — `validators/`

```javascript
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
```

```javascript
// schema para atualização — campos opcionais
// permite atualizar só o nome sem precisar mandar email e senha
export const updateUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional()
});
```

### `safeParse` vs `parse`

| Método | Comportamento |
|---|---|
| `schema.parse(data)` | Lança exceção se inválido |
| `schema.safeParse(data)` | Retorna `{ success, data }` ou `{ success, error }` sem lançar exceção |

O `safeParse` é preferível em middlewares porque evita try/catch e o retorno é mais previsível.

### Middleware de validação — `middlewares/validate.js`

O middleware recebe o schema como argumento e retorna uma função que valida o body antes de chegar no controller. Se inválido, retorna `400` com os erros detalhados por campo.

```javascript
export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map(e => ({
      field: e.path.join("."),  // nome do campo que falhou
      message: e.message        // mensagem definida no schema
    }));

    return res.status(400).json({
      status: "erro",
      message: "Dados inválidos. Verifique os campos e tente novamente.",
      errors
    });
  }

  next(); // validação passou — continua para o controller
};
```

### Uso nas rotas

O middleware é passado como argumento antes do controller, na ordem em que deve executar:

```javascript
// sem auth — valida só o body
router.post("/", validateSchema(createUserSchema), createUser);

// com auth — valida body e depois verifica token
router.put("/:id", authMiddleware, validateSchema(updateUserSchema), updateUser);
```

### Exemplo de resposta com erro

```json
{
  "status": "erro",
  "message": "Dados inválidos. Verifique os campos e tente novamente.",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "password", "message": "A senha deve ter no mínimo 6 caracteres" }
  ]
}
```

---

## Segurança de Headers — Helmet

### O que é Helmet

**Helmet** é um middleware que adiciona headers de segurança HTTP nas respostas da API automaticamente. Sem ele, o Express não define esses headers por padrão, deixando a API vulnerável a ataques comuns como XSS e clickjacking.

### Como usar

```javascript
import helmet from "helmet";

const app = express();
app.use(helmet()); // deve vir antes das rotas
```

Uma linha é suficiente para ativar todas as proteções padrão.

### Headers adicionados pelo Helmet

| Header | O que faz |
|---|---|
| `Content-Security-Policy` | Protege contra XSS controlando de onde recursos podem ser carregados |
| `X-Frame-Options: SAMEORIGIN` | Protege contra clickjacking — impede que a página seja exibida em iframe de outro domínio |
| `X-Content-Type-Options: nosniff` | Impede que o navegador tente adivinhar o tipo do conteúdo |
| `Strict-Transport-Security` | Força o uso de HTTPS nas próximas requisições |
| `Referrer-Policy: no-referrer` | Controla quais informações são enviadas no header Referrer |
| `X-DNS-Prefetch-Control: off` | Desativa o prefetch de DNS |
| `X-Download-Options: noopen` | Impede que o IE abra arquivos diretamente |
| `X-XSS-Protection: 0` | Desativa o filtro XSS antigo do navegador (substituído pelo CSP) |
