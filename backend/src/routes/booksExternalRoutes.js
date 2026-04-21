import express from "express";
import { buscarLivros } from "../controllers/booksExternalController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/books/search", authMiddleware, buscarLivros);

export default router;
