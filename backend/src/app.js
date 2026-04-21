import express from "express";
import db from "./config/dbConnect.js";
import cspMiddleware from "./middlewares/csp.js";
import routes from "./routes/index.js";
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js";
import cors from "cors";

db.on("error", console.log.bind(console, "Erro de conexao"));
db.once("open", () => {
  console.log("Conexao com o banco feita com sucesso");
});

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({ origin: frontendUrl }));
app.use(express.json());
app.use(cspMiddleware);

routes(app);

app.use(manipuladorDeErros);

export default app;
