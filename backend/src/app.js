import express from "express";
import cspMiddleware from "./middlewares/csp.js";
import routes from "./routes/index.js";
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js";
import cors from "cors";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({ origin: frontendUrl }));
app.use(express.json());
app.use(cspMiddleware);

routes(app);

app.use(manipuladorDeErros);

export default app;
