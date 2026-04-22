import express from "express";
import {
  register,
  login,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/cadastre-se", register);

router.post("/login", login);
router.post("/esqueci-minha-senha", requestPasswordReset);
router.post("/redefinir-senha", resetPassword);


export default router;
