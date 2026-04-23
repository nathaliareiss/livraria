import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  requestPasswordReset,
  validatePasswordResetCode,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/cadastre-se", register);

router.post("/login", login);
router.get("/perfil", authMiddleware, getProfile);
router.put("/perfil", authMiddleware, updateProfile);
router.post("/esqueci-minha-senha", requestPasswordReset);
router.post("/validar-codigo-recuperacao", validatePasswordResetCode);
router.post("/redefinir-senha", resetPassword);


export default router;
