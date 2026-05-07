# Estudando API REST com Express e Node.js

## Conceitos Fundamentais

### Rotas, Endpoints e Métodos HTTP

Toda API possui uma **rota**, um **endpoint** e um **método HTTP**.

| Método   | Descrição                          |
|----------|------------------------------------|
| `GET`    | Buscar dados                       |
| `POST`   | Criar dados                        |
| `PUT`    | Atualizar dados                    |
| `PATCH`  | Atualizar dados parcialmente       |
| `DELETE` | Deletar dados                      |

---

### Request e Response

| Conceito     | Descrição                                         |
|--------------|---------------------------------------------------|
| `REQUEST`    | Requisição do **cliente para o servidor** (o que o cliente manda) |
| `RESPONSE`   | Resposta do **servidor para o cliente** (o que você devolve)      |

---

### Status Codes

Códigos de status indicam se uma requisição foi bem-sucedida ou se houve algum erro.

| Código | Nome                    | Descrição                                                                 |
|--------|-------------------------|---------------------------------------------------------------------------|
| `200`  | OK                      | Requisição bem-sucedida, o servidor processou e devolveu uma resposta     |
| `201`  | Created                 | Um recurso foi criado com sucesso                                         |
| `204`  | No Content              | Requisição bem-sucedida, mas não há conteúdo para devolver                |
| `400`  | Bad Request             | A requisição do cliente não foi entendida pelo servidor                   |
| `401`  | Unauthorized            | O cliente não tem autorização para acessar o recurso                      |
| `403`  | Forbidden               | O cliente não tem permissão para acessar o recurso                        |
| `404`  | Not Found               | O recurso solicitado não foi encontrado no servidor                       |
| `500`  | Internal Server Error   | Erro no servidor ao processar a requisição                                |

---

### Body e Params

| Conceito  | Descrição                                                        |
|-----------|------------------------------------------------------------------|
| `body`    | Corpo da requisição — o que o cliente manda no corpo (ex: JSON) |
| `params`  | Parâmetros da rota — o que o cliente manda na URL (ex: `/users/:id`) |

---

## Estrutura do Projeto

```
projeto/
├── server.js
├── routes/
│   └── userRoute.js
└── controllers/
    └── userController.js
```

---

## Servidor Principal — `server.js`

```javascript
import express from "express";
import userRoutes from "./routes/userRoute.js";

const app = express(); // criando o servidor express

// Middleware para ler o corpo da requisição em formato JSON
app.use(express.json());

// Importando as rotas do userRoute e usando no servidor
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Api rodando com express");
});

// Inicia o servidor na porta 3333
app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
```

---

## Rotas — `routes/userRoute.js`

```javascript
import { Router } from 'express';

const router = Router(); // criando uma instância do Router do express

router.get("/", (req, res) => {
  // res.send() — finaliza a resposta com texto
  // res.end()  — finaliza a resposta sem corpo
  // res.json() — envia resposta em formato JSON
  res.json({
    message: "Lista de users",
  });
});

export default router; // exportando o router para ser usado no server.js
```

---

## Controllers — `controllers/userController.js`

```javascript
// Array para armazenar os usuários sem banco de dados
let users = [];

// Buscar todos os usuários
// Callback = função passada como parâmetro para outra função
export const getUsers = (req, res) => {
  return res.json(users);
};

// Criar usuário
export const createUser = (req, res) => {
  const { name, email } = req.body; // cliente manda nome e email no corpo da requisição

  users.push({ name, email });

  return res.status(201).json({ name, email }); // 201 Created
};

// Deletar usuário
export const deleteUser = (req, res) => {
  const { id } = req.params; // cliente manda o id na URL

  users = users.filter(user => user.id != id);

  return res.sendStatus(204); // 204 No Content
};
```