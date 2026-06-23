import bcrypt from "bcrypt";
import { users } from "../users.js";

export const getUsers = (req, res)=>{ // => isso é um callback, funcao que passa como parametro para outra funcao
  const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
  return res.json(usersWithoutPassword);
}


//BODY - corpo da requisição, o que o cliente manda para o servidor
//PARAMS - parametros da rota, o que o cliente manda para o servidor na url

//criar usuario
export const createUser = async (req, res)=>{ // adionando async
  const { name, email, password } = req.body; //cliente manda nome e email para o servidor

  //Transformar a senha em hash, await pq é uma funcao assincrona, precisa esperar a funcao terminar para continuar
  const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds de hash, quanto maior o número, mais seguro, mas mais lento

  // criando objeto do usuário
  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword // armazenando a senha criptografada direto no objeto do usuário
  };

  users.push(user); // adicionando o usuario no array de usuarios

  return res.status(201).json({ // 201 Created — não retorna a senha nem o hash
    id: user.id,
    name: user.name,
    email: user.email
  });
}

//editar usuario
export const updateUser = async (req, res) => {
  const { id } = req.params; //cliente manda o id do usuario para o servidor
  const { name, email, password } = req.body;

  const user = users.find(u => u.id == id); // encontrar o usuario no array de usuarios

  if (!user) {
    return res.status(404).json({
      message: "Usuário não encontrado"
    });
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
