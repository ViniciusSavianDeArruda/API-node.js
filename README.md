# API REST com Node.js e Express

Projeto de estudo de desenvolvimento de APIs REST com Node.js. Estou construindo essa API do zero para aprender na prática os conceitos de rotas, controllers, middlewares, autenticação JWT e documentação com Swagger. O projeto está em constante evolução conforme avanço nos estudos.

## O que foi implementado até agora

- Servidor Express com suporte a JSON e form data
- CRUD de usuários (criar, listar, atualizar e deletar)
- Senhas criptografadas com bcrypt — nunca armazenadas ou retornadas em texto puro
- Autenticação com JWT — login gera um token que protege rotas específicas
- Validação de dados com Zod — campos obrigatórios, formato de email e tamanho mínimo de senha
- Documentação interativa com OpenAPI/Swagger — com autenticação Bearer integrada (botão Authorize)
- Separação em camadas: routes → middlewares → controllers → validators

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) — framework web
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — criptografia de senhas
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — geração e validação de tokens JWT
- [zod](https://zod.dev) — validação de dados de entrada
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
| `PUT`    | `/users/:id`    | **Sim** | Atualiza um usuário     |
| `DELETE` | `/users/:id`    | **Sim** | Remove um usuário       |

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
│   ├── auth.middlewares.js    — validação do token JWT em rotas protegidas
│   └── validate.js            — middleware de validação com Zod
├── validators/
│   ├── userSchema.js          — schemas de criar usuário e login
│   └── updateUserSchema.js    — schema de atualização de usuário
└── docs/
    └── openapi.js             — configuração do Swagger
```

## Fluxo de uma requisição

```
Cliente
  ↓
server.js     →  direciona para a rota correta
  ↓
routes/       →  aplica middlewares na ordem
  ↓
validate.js   →  valida o body com Zod (se inválido → 400)
  ↓
authMiddleware →  valida o token JWT (se inválido → 401)
  ↓
controllers/  →  processa a lógica e devolve a resposta
```

## Observações

- Os dados dos usuários ficam em memória (array em `users.js`). Ao reiniciar o servidor, os dados são perdidos — banco de dados é um próximo passo nos estudos.
- As anotações `@openapi` ficam diretamente nos arquivos de rota. O `swagger-jsdoc` lê esses comentários automaticamente e monta a documentação sem precisar editar o `openapi.js` a cada nova rota.
- Para testar rotas protegidas no Swagger: faça login em `POST /auth/login`, copie o token da resposta, clique em **Authorize** no topo da página e cole o token. A partir daí o Swagger manda o token automaticamente em todas as requisições.

## Anotações de estudo

Todos os conceitos estudados durante o desenvolvimento — HTTP, JWT, middleware, destructuring, status codes e mais — estão documentados em [NOTES.md](NOTES.md).
