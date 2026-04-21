import express from "express";
import {
  connectGoogle,
  disconnectGoogle,
  getGoogleAuthUrl,
  googleCallback,
} from "../controllers/googleController.js";
import authMiddleWare from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/auth/google/url", authMiddleWare, getGoogleAuthUrl);
router.get("/auth/google", authMiddleWare, connectGoogle);
router.get("/auth/google/callback", googleCallback);
router.delete("/auth/google", authMiddleWare, disconnectGoogle);

export default router;
