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

Middleware é uma função que fica **no meio** do caminho entre a requisição e a resposta. Ela pode modificar o `req`, o `res`, ou simplesmente processar algo antes de passar para o próximo passo.

```javascript
app.use(express.json());
```

Nesse caso, `express.json()` é um middleware que lê o corpo da requisição e converte o JSON em um objeto JavaScript antes de chegar no seu controller. Sem ele, `req.body` seria `undefined`.

O `app.use()` serve para registrar middlewares e rotas no servidor. Tudo que passar por ali vai ser executado para toda requisição.

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

| Método          | Quando usar                                              |
|-----------------|----------------------------------------------------------|
| `res.json()`    | Retornar dados em formato JSON (mais comum em APIs)      |
| `res.send()`    | Retornar texto simples ou HTML                           |
| `res.status()`  | Definir o status code antes de enviar (encadeável)       |
| `res.sendStatus()` | Enviar apenas o status code, sem corpo             |

```javascript
res.json(users);                    // 200 + dados em JSON
res.status(201).json(user);         // 201 + dados em JSON
res.sendStatus(204);                // 204 sem corpo
```

---

## Estrutura do Projeto

```
projeto/
├── server.js           — ponto de entrada, configura e inicia o servidor
├── routes/
│   └── userRoute.js    — define os endpoints e conecta ao controller
├── controllers/
│   └── UserController.js — contém a lógica de cada operação
└── docs/
    └── openapi.js      — configuração do Swagger para documentação
```

Separar o projeto em camadas mantém o código organizado. As rotas não precisam saber como a lógica funciona, só a quem chamar.

---

## Servidor Principal — `server.js`

```javascript
import express from "express";
import userRoutes from "./routes/userRoute.js";
import specs from "./docs/openapi.js";
import swaggerUi from "swagger-ui-express";

const app = express(); // criando o servidor express

// Middleware para ler o corpo da requisição em formato JSON
app.use(express.json());

// Todas as rotas que começam com /users serão tratadas pelo userRoutes
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Api rodando com express");
});

// Rota da documentação Swagger — acessível em http://localhost:3333/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Inicia o servidor na porta 3333
app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
```

---

## Rotas — `routes/userRoute.js`

As rotas conectam os endpoints HTTP às funções do controller. Em vez de escrever toda a lógica aqui, a rota apenas chama a função responsável.

As anotações `@openapi` acima de cada rota são comentários especiais lidos pelo `swagger-jsdoc` para gerar a documentação automaticamente.

```javascript
import { Router } from 'express';
import { getUsers, createUser, deleteUser } from "../controllers/UserController.js";

const router = Router(); // Router é um mini-servidor que gerencia um grupo de rotas

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
router.get("/", getUsers);

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

## Controllers — `controllers/UserController.js`

Os controllers contêm a lógica de cada operação. Recebem o `req` e o `res` e decidem o que fazer com a requisição.

```javascript
let users = []; // simulando um banco de dados com um array em memória

// Buscar todos os usuários — apenas retorna o array completo
export const getUsers = (req, res) => {
  return res.json(users);
};

// Criar usuário
export const createUser = (req, res) => {
  const { name, email } = req.body; // extrai os dados do corpo da requisição

  const user = {
    id: users.length + 1, // gera um id simples baseado no tamanho do array
    name,
    email,
  };

  users.push(user); // adiciona o novo usuário no array

  return res.status(201).json(user); // retorna o usuário criado com status 201
};

// Deletar usuário
export const deleteUser = (req, res) => {
  const { id } = req.params; // pega o id da URL

  // filter cria um novo array sem o usuário com o id informado
  // usa != (não estrito) porque req.params retorna string e user.id é number
  users = users.filter(user => user.id != id);

  return res.sendStatus(204); // sem corpo na resposta, só o status 204
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
    openapi: "3.0.0",        // versão do padrão OpenAPI
    info: {
      title: "API Node Estudos",
      version: "1.0.0",
      description: "Documentação da API com OpenAPI",
    },
    servers: [
      {
        url: "http://localhost:3333", // URL base da API
      },
    ],
  },
  apis: ["./routes/*.js"], // caminho dos arquivos com anotações @openapi
};

// Gera o objeto de especificação com base nas opções e nas anotações das rotas
const specs = swaggerJsdoc(options);

export default specs;
```