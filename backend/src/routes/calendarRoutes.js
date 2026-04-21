import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { criarEvento,listarEventos,deletarEvento } from "../controllers/calendarController.js";

const router = express.Router();

router.post("/calendar/event",authMiddleware, criarEvento);
router.get("/calendar/events",authMiddleware, listarEventos);
router.delete("/calendar/event/:eventId",authMiddleware,deletarEvento);

export default router;
