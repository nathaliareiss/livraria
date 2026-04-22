import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const port = process.env.PORT || 8001;

try {
  const { connectDb } = await import("./src/config/dbConnect.js");
  await connectDb();
  const { default: app } = await import("./src/app.js");

  app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
  });
} catch (error) {
  console.error("Servidor nao iniciado porque o banco nao conectou.");
  process.exit(1);
}
