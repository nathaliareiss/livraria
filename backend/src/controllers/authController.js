import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/dbConnect.js";
import User from "../models/usuario.js";
import { createUser as createLocalUser, findUserByEmail as findLocalUserByEmail } from "../services/localUserStore.js";

function isMongoAvailable() {
  return db.readyState === 1;
}

function getUserId(user) {
  return user?._id?.toString?.() || user?._id || user?.id;
}

export async function register(req, res) {
  try {
    const { nome, dataNascimento, email, senha } = req.body;

    const usuarioExiste = isMongoAvailable()
      ? await User.findOne({ email })
      : await findLocalUserByEmail(email);

    if (usuarioExiste) {
      return res.status(400).json({ mensagem: "Usuário já existe" });
    }

    if (!senha || senha.length < 8) {
      return res.status(400).json({ mensagem: "Senha deve ter pelo menos 8 caracteres" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = isMongoAvailable()
      ? await User.create({
          nome,
          dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
          email,
          senha: senhaHash,
        })
      : await createLocalUser({
          nome,
          dataNascimento,
          email,
          senha: senhaHash,
        });

    const userId = getUserId(novoUsuario);
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      userId,
      token,
      user: {
        id: userId,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        dataNascimento: novoUsuario.dataNascimento,
      },
    });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
}

export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    const user = isMongoAvailable()
      ? await User.findOne({ email })
      : await findLocalUserByEmail(email);

    if (!user) {
      return res.status(401).json({ mensagem: "Email ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: getUserId(user) }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: getUserId(user),
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (erro) {
    next(erro);
  }
}
