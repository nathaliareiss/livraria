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
    console.error("Erro ao buscar livros externos:", error.message);

    if (error.response?.status) {
      return res.status(502).json({
        mensagem: "Nao foi possivel consultar o Google Books no momento.",
      });
    }

    res.status(500).json({ mensagem: "Erro ao buscar livros" });
  }
}
