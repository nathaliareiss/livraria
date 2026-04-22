import { buscarLivrosGoogle } from "../services/googleBooksService.js";
import { buscarLivrosLocal } from "../services/localBooksFallback.js";

export async function buscarLivros(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ mensagem: "Informe um termo de busca" });
    }

    const livros = await buscarLivrosGoogle(q);

    res.json(livros);
  } catch (error) {
    console.error("Erro ao buscar livros externos:", error.message);
    const fallbackLivros = await buscarLivrosLocal(req.query.q);

    return res.json(fallbackLivros);
  }
}
