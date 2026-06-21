# API REST com Node.js e Express

Projeto de estudo de desenvolvimento de APIs REST com Node.js. Estou construindo essa API do zero para aprender na prática os conceitos de rotas, controllers, middlewares, autenticação JWT e documentação com Swagger. O projeto está em constante evolução conforme avanço nos estudos.

## O que foi implementado até agora

- Servidor Express com suporte a JSON e form data
- CRUD de usuários (criar, listar, atualizar e deletar)
- Autenticação com JWT — login gera um token que protege rotas específicas
- Documentação interativa com OpenAPI/Swagger
- Separação em camadas: routes → middlewares → controllers

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) — framework web
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — geração e validação de tokens JWT
- [dotenv](https://github.com/motdotla/dotenv) — variáveis de ambiente
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) + [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) — documentação da API
- [nodemon](https://github.com/remy/nodemon) — hot reload em desenvolvimento

## Instalação

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com a chave do JWT:

```env
JWT_SECRET=sua_chave_secreta_aqui
```

> O arquivo `.env` está no `.gitignore` e nunca deve ser enviado ao Git.

## Como rodar

```bash
# desenvolvimento (reinicia o servidor automaticamente ao salvar)
npm run dev

# produção
npm start
```

O servidor sobe em `http://localhost:3333`.

A documentação interativa fica em `http://localhost:3333/docs`.

## Endpoints

| Método   | Rota            | Auth?   | Descrição               |
|----------|-----------------|---------|-------------------------|
| `POST`   | `/auth/login`   | Não     | Gera um token JWT       |
| `GET`    | `/users`        | **Sim** | Lista todos os usuários |
| `POST`   | `/users`        | Não     | Cria um novo usuário    |
| `PUT`    | `/users/:id`    | Não     | Atualiza um usuário     |
| `DELETE` | `/users/:id`    | Não     | Remove um usuário       |

Rotas marcadas com **Sim** exigem o token JWT no header de todas as requisições:

```
Authorization: Bearer <token>
```

### Exemplo de uso

**1. Criar um usuário**
```http
POST /users
Content-Type: application/json

{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

**2. Fazer login e receber o token**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

**3. Usar o token para acessar rota protegida**
```http
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

## Estrutura do projeto

```
├── .env                       — variáveis de ambiente (não sobe no Git)
├── .gitignore
├── package.json
├── server.js                  — ponto de entrada, configura e inicia o servidor
├── users.js                   — array de usuários compartilhado em memória
├── routes/
│   ├── auth.route.js          — rota de login
│   └── user.route.js          — rotas de usuários (com anotações @openapi)
├── controllers/
│   ├── authController.js      — lógica de autenticação e geração do token
│   └── userController.js      — lógica de usuários (listar, criar, atualizar, deletar)
├── middlewares/
│   └── auth.middlewares.js    — validação do token JWT em rotas protegidas
└── docs/
    └── openapi.js             — configuração do Swagger
```

## Fluxo de uma requisição

```
Cliente
  ↓
server.js  →  direciona para a rota correta
  ↓
routes/    →  aplica middleware (se a rota exigir autenticação)
  ↓
middlewares/  →  valida o token JWT, chama next()
  ↓
controllers/  →  processa a lógica e devolve a resposta
```

## Observações

- Os dados dos usuários ficam em memória (array em `users.js`). Ao reiniciar o servidor, os dados são perdidos — banco de dados é um próximo passo nos estudos.
- As anotações `@openapi` ficam diretamente nos arquivos de rota. O `swagger-jsdoc` lê esses comentários automaticamente e monta a documentação sem precisar editar o `openapi.js` a cada nova rota.

## Anotações de estudo

Todos os conceitos estudados durante o desenvolvimento — HTTP, JWT, middleware, destructuring, status codes e mais — estão documentados em [NOTES.md](NOTES.md).
