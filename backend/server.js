import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const { default: app } = await import("./src/app.js");

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
});
