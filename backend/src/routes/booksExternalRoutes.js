import express from "express";
import { buscarLivros } from "../controllers/booksExternalController.js";

const router = express.Router();

router.get("/books/search", buscarLivros);

export default router;
