import { users } from "../users.js";

export const getUsers = (req, res)=>{ // => isso é um callback, funcao que passa como parametro para outra funcao
  return res.json(users);
}


//BODY - corpo da requisição, o que o cliente manda para o servidor
//PARAMS - parametros da rota, o que o cliente manda para o servidor na url

//criar usuario
export const createUser = (req, res)=>{
  const {name, email, password} = req.body; //cliente manda nome e email para o servidor

  // criando objeto do usuário
  const user = {
    id: users.length + 1,
    name,
    email,
    password
  };

  users.push(user); // adicionando o usuario no array de usuarios

  return res.status(201).json(user); // status 201 - criado, para indicar que o usuario foi criado com sucesso
}


//Deletar usuario
export const deleteUser = (req, res)=>{
  const { id } = req.params; //cliente manda o id do usuario para o servidor

  // Encontrar o índice do usuário no array
  const index = users.findIndex(user => user.id == id);

  // Verificar se o usuário existe
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  users.splice(index, 1);

  return res.sendStatus(204); // status 204 - no content, para indicar que o usuario foi deletado com sucesso
}
