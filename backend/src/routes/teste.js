import express from "express";
import { getAuthClient } from "../config/googleOAuth.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/teste-google", authMiddleware, async (req, res) => {
  try {
    await getAuthClient(req.userId);

    res.json({ ok: true, mensagem: "Conta Google conectada" });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

export default router;
