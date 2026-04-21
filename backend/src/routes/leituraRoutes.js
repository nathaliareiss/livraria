import express from "express";
import leituraController from "../controllers/leituraController.js";
import authMiddleware from "../middlewares/authMiddleware.js";



const router = express.Router();

router.post("/leitura/iniciar/:livroId",authMiddleware, leituraController.iniciarLeitura);
router.post("/leitura/finalizar/:livroId",authMiddleware, leituraController.finalizarLeitura);
router.get("/leitura",authMiddleware, leituraController.listarLeituras);

export default router;