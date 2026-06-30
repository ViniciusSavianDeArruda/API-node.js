import bcrypt from "bcrypt";
import { users } from "../users.js";

export const getUsers = (req, res, next) => {
  try {
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
    return res.json(usersWithoutPassword);
  } catch (err) {
    next(err); // passa o erro para o errorHandler
  }
}


//BODY - corpo da requisição, o que o cliente manda para o servidor
//PARAMS - parametros da rota, o que o cliente manda para o servidor na url

//criar usuario
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // transforma a senha em hash antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword // armazena o hash, nunca a senha em texto puro
    };

    users.push(user);

    return res.status(201).json({ // 201 Created — não retorna a senha nem o hash
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    next(err); // passa o erro para o errorHandler
  }
}

//editar usuario
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // id vem na URL: PUT /users/:id
    const { name, email, password } = req.body;

    const user = users.find(u => u.id == id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // gera novo hash se a senha for alterada
    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email // não retorna a senha
    });
  } catch (err) {
    next(err); // passa o erro para o errorHandler
  }
}


//Deletar usuario
export const deleteUser = (req, res, next) => {
  try {
    const { id } = req.params; // id vem na URL: DELETE /users/:id

    // findIndex retorna -1 se não encontrar
    const index = users.findIndex(user => user.id == id);

    if (index === -1) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    users.splice(index, 1); // remove o usuário do array

    return res.sendStatus(204); // 204 No Content — sem corpo na resposta
  } catch (err) {
    next(err); // passa o erro para o errorHandler
  }
}
