import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/dbConnect.js";
import User from "../models/usuario.js";
import {
  clearPasswordResetCode as clearLocalPasswordResetCode,
  createUser as createLocalUser,
  findUserByEmail as findLocalUserByEmail,
  setPasswordResetCode as setLocalPasswordResetCode,
  updatePasswordByEmail as updateLocalPasswordByEmail,
} from "../services/localUserStore.js";

function isMongoAvailable() {
  return db.readyState === 1;
}

function getUserId(user) {
  return user?._id?.toString?.() || user?._id || user?.id;
}

function generateRecoveryCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findUserByEmail(email) {
  return isMongoAvailable()
    ? User.findOne({ email })
    : findLocalUserByEmail(email);
}

async function setPasswordResetCode(email, codeHash, expiresAt) {
  if (isMongoAvailable()) {
    return User.findOneAndUpdate(
      { email },
      {
        passwordResetCodeHash: codeHash,
        passwordResetExpiresAt: expiresAt,
      },
      { new: true }
    );
  }

  return setLocalPasswordResetCode(email, codeHash, expiresAt);
}

async function clearPasswordResetCode(email) {
  if (isMongoAvailable()) {
    return User.findOneAndUpdate(
      { email },
      {
        passwordResetCodeHash: null,
        passwordResetExpiresAt: null,
      },
      { new: true }
    );
  }

  return clearLocalPasswordResetCode(email);
}

async function updatePasswordByEmail(email, senhaHash) {
  if (isMongoAvailable()) {
    return User.findOneAndUpdate(
      { email },
      {
        senha: senhaHash,
        passwordResetCodeHash: null,
        passwordResetExpiresAt: null,
      },
      { new: true }
    );
  }

  return updateLocalPasswordByEmail(email, senhaHash);
}

export async function register(req, res) {
  try {
    const { nome, dataNascimento, email, senha } = req.body;

    const usuarioExiste = await findUserByEmail(email);

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

    const user = await findUserByEmail(email);

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

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ mensagem: "Informe seu email" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    const recoveryCode = generateRecoveryCode();
    const codeHash = await bcrypt.hash(recoveryCode, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await setPasswordResetCode(email, codeHash, expiresAt);

    res.json({
      mensagem: "Codigo de recuperacao gerado com sucesso",
      recoveryCode,
      expiresAt,
    });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao gerar codigo de recuperacao" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, recoveryCode, novaSenha, confirmarSenha } = req.body;

    if (!email || !recoveryCode || !novaSenha || !confirmarSenha) {
      return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({ mensagem: "As senhas nao coincidem" });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({ mensagem: "Senha deve ter pelo menos 8 caracteres" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    const expiresAt = user.passwordResetExpiresAt ? new Date(user.passwordResetExpiresAt) : null;
    if (!user.passwordResetCodeHash || !expiresAt || expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ mensagem: "Codigo de recuperacao expirado ou invalido" });
    }

    const codeValid = await bcrypt.compare(recoveryCode, user.passwordResetCodeHash);
    if (!codeValid) {
      return res.status(400).json({ mensagem: "Codigo de recuperacao invalido" });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await updatePasswordByEmail(email, senhaHash);
    await clearPasswordResetCode(email);

    res.json({ mensagem: "Senha alterada com sucesso" });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao redefinir senha" });
  }
}
