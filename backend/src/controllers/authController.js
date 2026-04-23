import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import db from "../config/dbConnect.js";
import User from "../models/usuario.js";
import { sendPasswordResetCodeEmail } from "../services/emailService.js";
import {
  clearPasswordResetCode as clearLocalPasswordResetCode,
  createUser as createLocalUser,
  findUserByEmail as findLocalUserByEmail,
  findUserById as findLocalUserById,
  setPasswordResetCode as setLocalPasswordResetCode,
  updateUserProfileById as updateLocalUserProfileById,
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

function getRequestEmail(req) {
  return normalizeEmail(req.headers["x-user-email"]);
}

function buildMongoEmailMatch(email) {
  const normalizedEmail = normalizeEmail(email);
  const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`^${escapedEmail}$`, "i");
}

function isMongoObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
}

async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  return isMongoAvailable()
    ? User.findOne({ email: buildMongoEmailMatch(normalizedEmail) })
    : findLocalUserByEmail(normalizedEmail);
}

async function findUserById(userId) {
  if (isMongoAvailable() && isMongoObjectId(userId)) {
    const user = await User.findById(userId);
    if (user) {
      return user;
    }
  }

  return findLocalUserById(userId);
}

async function findAuthenticatedUser(req) {
  const userById = await findUserById(req.userId);
  if (userById) {
    return userById;
  }

  const requestEmail = getRequestEmail(req);
  if (requestEmail) {
    return findUserByEmail(requestEmail);
  }

  return null;
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

async function updateUserProfile(userId, updates) {
  if (isMongoAvailable() && isMongoObjectId(userId)) {
    return User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });
  }

  return updateLocalUserProfileById(userId, updates);
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: getUserId(user),
    nome: user.nome,
    email: user.email,
    dataNascimento: user.dataNascimento ? new Date(user.dataNascimento).toISOString() : null,
  };
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

export async function getProfile(req, res) {
  try {
    const user = await findAuthenticatedUser(req);

    if (!user) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    res.json({ user: serializeUser(user) });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao carregar perfil" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { nome, email, dataNascimento } = req.body;
    const normalizedNome = String(nome || "").trim();
    const requestEmail = getRequestEmail(req);

    const currentUser = (await findUserById(req.userId)) || (requestEmail ? await findUserByEmail(requestEmail) : null);
    if (!currentUser) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    const nextNome = normalizedNome || String(currentUser.nome || "").trim();
    const nextEmail = normalizeEmail(email).toLowerCase() || normalizeEmail(currentUser.email).toLowerCase();
    const nextDataNascimento = dataNascimento ? new Date(dataNascimento) : currentUser.dataNascimento;

    if (!nextNome || !nextEmail) {
      return res.status(400).json({ mensagem: "Preencha nome e email" });
    }

    if (dataNascimento && Number.isNaN(nextDataNascimento.getTime())) {
      return res.status(400).json({ mensagem: "Data de nascimento invalida" });
    }

    const userWithEmail = await findUserByEmail(nextEmail);
    if (userWithEmail && String(getUserId(userWithEmail)) !== String(req.userId)) {
      return res.status(400).json({ mensagem: "Email ja esta em uso" });
    }

    const updates = {
      nome: nextNome,
      email: nextEmail,
    };

    if (dataNascimento || currentUser.dataNascimento) {
      updates.dataNascimento = nextDataNascimento;
    }

    const updatedUser = await updateUserProfile(getUserId(currentUser), updates);

    res.json({
      mensagem: "Perfil atualizado com sucesso",
      user: serializeUser(updatedUser),
    });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
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

    if (user) {
      const recoveryCode = generateRecoveryCode();
      const codeHash = await bcrypt.hash(recoveryCode, 10);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      try {
        await setPasswordResetCode(normalizedEmail, codeHash, expiresAt);
        await sendPasswordResetCodeEmail({ to: normalizedEmail, code: recoveryCode });
      } catch (emailError) {
        await clearPasswordResetCode(normalizedEmail);
        throw emailError;
      }
    }

    res.json({
      mensagem:
        "Se o email estiver cadastrado, um codigo de recuperacao foi enviado para sua caixa de entrada.",
    });
  } catch (erro) {
    res.status(500).json({
      mensagem:
        erro?.message ||
        "Erro ao enviar o codigo de recuperacao. Verifique a configuracao do servidor de email.",
    });
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
