import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getFavoritos,
  postFavorito,
  deleteFavorito,
} from "../controllers/favoritosController.js";

const router = express.Router();

router.post("/favoritos", authMiddleware, postFavorito);
router.get("/favoritos", authMiddleware, getFavoritos);
router.delete("/favoritos/:id", authMiddleware, deleteFavorito);

export default router;
