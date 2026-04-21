import User from "../models/usuario.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



export async function register(req, res) {
  try {
    const { nome,dataNascimento, email, senha } = req.body;
//aqui verifica se o usuario ja existe com esse email
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensagem: "Usuário já existe" });
    }

     // 2) Validar regras mínimas de senha (opcional, mas recomendado)
     if (!senha || senha.length < 8) {
      return res.status(400).json({ mensagem: "Senha deve ter pelo menos 8 caracteres" });
    }
    //aqui gera o hash da senha para segurranca
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await User.create({
      nome,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
      email,
      senha: senhaHash,
    });
//gera o token jwt no cadasto para ja sair logado
    const token = jwt.sign(
      { id: novoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      userId: novoUsuario._id,
      token, 
      user: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        dataNascimento: novoUsuario.dataNascimento}
    });

  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
}


export async function login(req, res, next) {
  try {

    const { email, senha } = req.body;

    const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(401).json({ mensagem: "Email ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
    });
   
  } catch (erro) {
    next(erro);
  }
}