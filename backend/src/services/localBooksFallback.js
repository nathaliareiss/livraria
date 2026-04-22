import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localBooksPath = path.join(__dirname, "..", "..", "..", "livros.json");

async function readLocalBooks() {
  const content = await fs.readFile(localBooksPath, "utf8");
  const books = JSON.parse(content);
  return Array.isArray(books) ? books : [];
}

export async function buscarLivrosLocal(query) {
  const termo = String(query || "").trim().toLowerCase();

  if (!termo) {
    return [];
  }

  const livros = await readLocalBooks();

  return livros
    .filter((livro) => String(livro.nome || "").toLowerCase().includes(termo))
    .map((livro) => ({
      googleId: `local_${livro.id}`,
      titulo: livro.nome,
      autores: [],
      editora: "Catalogo local",
      descricao: "",
      thumbnail: null,
      previewLink: null,
    }));
}
