import db from "../config/dbConnect.js";

export default function databaseAvailability(req, res, next) {
  if (req.method === "POST" && (req.path === "/login" || req.path === "/cadastre-se")) {
    return next();
  }

  if (db.readyState === 0 || db.readyState === 3) {
    return res.status(503).json({
      mensagem:
        "Banco de dados indisponivel no momento. Verifique STRING_CONEXAO_DB ou MONGO_URI.",
    });
  }

  next();
}
