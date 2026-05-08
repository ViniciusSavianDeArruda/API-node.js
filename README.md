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
- **Signature** — garante que o token não foi alterado, gerada com a secret-key

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
  jwt.verify(token, "secret-key");
  next(); // se chegou aqui, o token é válido
} catch (error) {
  // se der erro, cai aqui
  return res.status(401).json({ message: "Token inválido" });
}
```

---

## Estrutura do Projeto

```
projeto/
├── server.js                        — ponto de entrada, configura e inicia o servidor
├── routes/
│   ├── auth.route.js                — rota de login
│   └── userRoute.js                 — rotas de usuários (protegidas)
├── controllers/
│   ├── authController.js            — lógica de autenticação
│   └── UserController.js            — lógica de usuários
├── middlewares/
│   └── auth.middlewares.js          — valida o token JWT em rotas protegidas
└── docs/
    └── openapi.js                   — configuração do Swagger
```

---

## Servidor Principal — `server.js`

```javascript
import express from "express";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/auth.route.js";
import specs from "./docs/openapi.js";
import swaggerUi from "swagger-ui-express";

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
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post("/login", login);

export default router;
```

---

## Rotas de usuários — `routes/userRoute.js`

Repare que o `authMiddleware` é passado como segundo argumento na rota `GET /users`. Isso significa que toda requisição para listar usuários precisa passar pela validação do token antes de chegar no controller.

As rotas `POST` e `DELETE` não têm o middleware, então não exigem autenticação nesse exemplo.

```javascript
import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { getUsers, createUser, deleteUser } from "../controllers/UserController.js";

const router = Router();

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
router.get("/", authMiddleware, getUsers); // authMiddleware protege essa rota

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
```

---

## Controller de autenticação — `controllers/authController.js`

```javascript
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { email, password } = req.body;

  // Valida as credenciais — em produção isso viria de um banco de dados
  if (email !== "admin@gmail.com" || password !== "123456") {
    return res.status(401).json({
      message: "Email ou senha inválidos"
    });
  }

  // jwt.sign(payload, secret, options)
  // payload  — dados que ficam dentro do token (não coloque senhas aqui)
  // secret   — chave usada para assinar o token (em produção, use variável de ambiente)
  // expiresIn — tempo de expiração do token
  const token = jwt.sign(
    { email },       // payload
    "secret-key",    // secret
    { expiresIn: "1d" } // expira em 1 dia
  );

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
    // jwt.verify lança um erro se o token for inválido ou expirado
    jwt.verify(token, "secret-key");

    next(); // token válido — continua para o controller
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido"
    });
  }
};
```

---

## Controller de usuários — `controllers/UserController.js`

```javascript
let users = []; // simulando um banco de dados com um array em memória

// Buscar todos os usuários — rota protegida pelo authMiddleware
export const getUsers = (req, res) => {
  return res.json(users);
};

// Criar usuário
export const createUser = (req, res) => {
  const { name, email } = req.body;

  const user = {
    id: users.length + 1, // id simples baseado no tamanho do array
    name,
    email,
  };

  users.push(user);

  return res.status(201).json(user); // 201 Created
};

// Deletar usuário
export const deleteUser = (req, res) => {
  const { id } = req.params;

  // != (não estrito) porque req.params retorna string e user.id é number
  users = users.filter(user => user.id != id);

  return res.sendStatus(204); // 204 No Content
};
```

---

## Documentação com OpenAPI/Swagger — `docs/openapi.js`

O **Swagger** permite visualizar e testar os endpoints da API pelo navegador, sem precisar de ferramentas como Insomnia ou Postman.

- `swagger-jsdoc` lê os comentários `@openapi` nos arquivos de rota e monta a documentação
- `swagger-ui-express` serve essa documentação como uma página web

Após iniciar o servidor, acesse: [http://localhost:3333/docs](http://localhost:3333/docs)

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
  },
  apis: ["./routes/*.js"], // lê todos os arquivos de rota em busca de anotações @openapi
};

const specs = swaggerJsdoc(options);

export default specs;
```