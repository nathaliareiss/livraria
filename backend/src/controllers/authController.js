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

function normalizeEmail(email) {
  return String(email || "").trim();
}

function buildMongoEmailMatch(email) {
  const normalizedEmail = normalizeEmail(email);
  const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`^${escapedEmail}$`, "i");
}

async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  return isMongoAvailable()
    ? User.findOne({ email: buildMongoEmailMatch(normalizedEmail) })
    : findLocalUserByEmail(normalizedEmail);
}

async function setPasswordResetCode(email, codeHash, expiresAt) {
  const normalizedEmail = normalizeEmail(email);

  if (isMongoAvailable()) {
    return User.findOneAndUpdate(
      { email: buildMongoEmailMatch(normalizedEmail) },
      {
        passwordResetCodeHash: codeHash,
        passwordResetExpiresAt: expiresAt,
      },
      { new: true }
    );
  }

  return setLocalPasswordResetCode(normalizedEmail, codeHash, expiresAt);
}

async function clearPasswordResetCode(email) {
  const normalizedEmail = normalizeEmail(email);

  if (isMongoAvailable()) {
    return User.findOneAndUpdate(
      { email: buildMongoEmailMatch(normalizedEmail) },
      {
        passwordResetCodeHash: null,
        passwordResetExpiresAt: null,
      },
      { new: true }
    );
  }

  return clearLocalPasswordResetCode(normalizedEmail);
}

async function updatePasswordByEmail(email, senhaHash) {
  const normalizedEmail = normalizeEmail(email);

  if (isMongoAvailable()) {
    return User.findOneAndUpdate(
      { email: buildMongoEmailMatch(normalizedEmail) },
      {
        senha: senhaHash,
        passwordResetCodeHash: null,
        passwordResetExpiresAt: null,
      },
      { new: true }
    );
  }

  return updateLocalPasswordByEmail(normalizedEmail, senhaHash);
}

async function getValidPasswordResetUser(email, recoveryCode) {
  const user = await findUserByEmail(email);

  if (!user) {
    return { error: { status: 404, mensagem: "Usuario nao encontrado" } };
  }

  const expiresAt = user.passwordResetExpiresAt ? new Date(user.passwordResetExpiresAt) : null;
  if (!user.passwordResetCodeHash || !expiresAt || expiresAt.getTime() < Date.now()) {
    return {
      error: {
        status: 400,
        mensagem: "Codigo de recuperacao expirado ou invalido",
      },
    };
  }

  const codeValid = await bcrypt.compare(recoveryCode, user.passwordResetCodeHash);
  if (!codeValid) {
    return {
      error: {
        status: 400,
        mensagem: "Codigo de recuperacao invalido",
      },
    };
  }

  return { user };
}

export async function register(req, res) {
  try {
    const { nome, dataNascimento, email, senha } = req.body;
    const normalizedEmail = normalizeEmail(email).toLowerCase();

    const usuarioExiste = await findUserByEmail(normalizedEmail);

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
          email: normalizedEmail,
          senha: senhaHash,
        })
      : await createLocalUser({
          nome,
          dataNascimento,
          email: normalizedEmail,
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
    const normalizedEmail = normalizeEmail(email).toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

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
    const normalizedEmail = normalizeEmail(email).toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ mensagem: "Informe seu email" });
    }

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    const recoveryCode = generateRecoveryCode();
    const codeHash = await bcrypt.hash(recoveryCode, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await setPasswordResetCode(normalizedEmail, codeHash, expiresAt);

    res.json({
      mensagem: "Codigo de recuperacao gerado com sucesso",
      recoveryCode,
      expiresAt,
    });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao gerar codigo de recuperacao" });
  }
}

export async function validatePasswordResetCode(req, res) {
  try {
    const { email, recoveryCode } = req.body;
    const normalizedEmail = normalizeEmail(email).toLowerCase();

    if (!normalizedEmail || !recoveryCode) {
      return res.status(400).json({ mensagem: "Informe email e codigo de recuperacao" });
    }

    const result = await getValidPasswordResetUser(normalizedEmail, recoveryCode);
    if (result.error) {
      return res.status(result.error.status).json({ mensagem: result.error.mensagem });
    }

    res.json({ mensagem: "Codigo validado com sucesso" });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao validar codigo de recuperacao" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, recoveryCode, novaSenha, confirmarSenha } = req.body;
    const normalizedEmail = normalizeEmail(email).toLowerCase();

    if (!normalizedEmail || !recoveryCode || !novaSenha || !confirmarSenha) {
      return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({ mensagem: "As senhas nao coincidem" });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({ mensagem: "Senha deve ter pelo menos 8 caracteres" });
    }

    const result = await getValidPasswordResetUser(normalizedEmail, recoveryCode);
    if (result.error) {
      return res.status(result.error.status).json({ mensagem: result.error.mensagem });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await updatePasswordByEmail(normalizedEmail, senhaHash);
    await clearPasswordResetCode(normalizedEmail);

    res.json({ mensagem: "Senha alterada com sucesso" });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao redefinir senha" });
  }
}
