import express from "express";
import LivroController from "../controllers/livrosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";



const router = express.Router();

router
  .get("/livros",authMiddleware, LivroController.listarMeusLivros)
  .get("/estante", authMiddleware, LivroController.resumoEstante)
  .post("/livros",authMiddleware, LivroController.adicionarLivro)
  .patch("/livros/:id/favorito",authMiddleware, LivroController.alternarFavorito)
  .patch("/livros/:id/quero-ler", authMiddleware, LivroController.alternarQueroLer);



  
export default router;  