import { buscarLivrosGoogle } from "../services/googleBooksService.js";

export async function buscarLivros(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ mensagem: "Informe um termo de busca" });
    }

    const livros = await buscarLivrosGoogle(q);

    res.json(livros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar livros" });
  }
}
