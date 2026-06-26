//Toda a api vai ter uma rota, endoint e um metodo http
/*GET - para buscar dados --> pode buscar pelo {id} ou buscar todos os usuarios
POST - para criar dados
PUT - para atualizar dados
PATCH - para atualizar dados parcialmente
DELETE - para deletar dados

Todo a api vai ter uma resposta do servidor para o cliente e um request requisicao do cliente para o servidor = response e request
RESPONSE - resposta do servidor para o cliente,(o que você devolve)
REQUEST - requisição do cliente para o servidor,(o que o cliente manda)

RESPOSTA DO SERVIDOR PARA O CLIENTE
STATUS CODE - código de status da resposta, para indicar se a requisição foi bem sucedida ou se houve algum erro
200 - OK - requisição bem sucedida, o servidor conseguiu processar a requisição e devolver uma resposta
201 - Created - criado, para indicar que um recurso foi criado com sucesso
204 - No Content - sem conteúdo, para indicar que a requisição foi bem sucedida mas não há conteúdo para devolver
400 - Bad Request - requisição mal formada, para indicar que a requisição do cliente não foi entendida pelo servidor
401 - Unauthorized - não autorizado, para indicar que o cliente não tem autorização para acessar o recurso
403 - Forbidden - proibido, para indicar que o cliente não tem permissão para acessar o recurso
404 - Not Found - não encontrado, para indicar que o recurso solicitado não foi encontrado no servidor
500 - Internal Server Error - erro interno do servidor, para indicar que houve um erro no servidor ao processar a requisição
*/

import "dotenv/config";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import specs from "./docs/openapi.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();
app.use(helmet()); // helmet para proteger a api de ataques, adicionando cabeçalhos de segurança
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rotas de autenticação
app.use("/auth", authRoutes);

// rotas de usuários
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Api rodando com express");
});

// rota da documentação
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// inicia servidor
app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
