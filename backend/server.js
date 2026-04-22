import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const port = process.env.PORT || 8001;

let dbReady = true;

try {
  const { connectDb } = await import("./src/config/dbConnect.js");
  await connectDb();
} catch (error) {
  dbReady = false;
  console.error("Banco nao conectou. Subindo o servidor em modo degradado.");
}

const { default: app } = await import("./src/app.js");

app.set("dbReady", dbReady);

app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
});
