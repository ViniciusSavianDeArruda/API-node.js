import {Router} from 'express';

const router = Router(); // criando uma instância do Router do express

router.get("/", (req, res)=>{
  // res.send("Api rodando com express"); // res.end() - para finalizar a resposta do servidor para o cliente ou res.json() - para enviar uma resposta em formato json 
  res.json({
    message: "Lista de users",
  });
});

export default router; // exportando o router para ser usado em outros arquivos, como no server.js
