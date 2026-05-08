//Toda a api vai ter uma rota, endoint e um metodo http
/*GET - para buscar dados
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

import express from "express";
import userRoutes from "./routes/userRoute.js";
import specs from "./docs/openapi.js";
import swaggerUi from "swagger-ui-express";

const app = express(); // criando o servidor express

//Middleware para ler o corpo da requisição em formato json
app.use(express.json());

//importando as rotas do userRoute e usando elas no servidor
app.use("/users", userRoutes);

app.get("/", (req, res)=>{
  res.send("Api rodando com express"); 
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs)); //rota do swagger 

//Inicia o servidor na porta 3333
app.listen(3333, ()=>{
  console.log("Servidor rodando na porta 3333");
});
