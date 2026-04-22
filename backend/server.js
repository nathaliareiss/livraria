import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const port = process.env.PORT || 8001;

async function bootstrap() {
  const dbModule = await import("./src/config/dbConnect.js");
  await dbModule.connectDb();
  dbModule.default.on("disconnected", () => {
    console.warn("MongoDB desconectado. O servidor continua ativo.");
  });

  const { default: app } = await import("./src/app.js");
  const server = app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
  });

  server.on("error", (error) => {
    console.error("Falha ao iniciar o servidor:", error.message);
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  console.error("Banco nao conectou. Encerrando aplicacao.");
  console.error(error.message);
  process.exit(1);
});
