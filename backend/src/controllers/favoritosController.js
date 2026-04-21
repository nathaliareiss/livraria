import Favorito from "../models/Favorito.js";

export const postFavorito = async (req, res) => {
  try {
    const { id, livroId, titulo, thumbnail } = req.body;
    const favoritoId = livroId || id;

    if (!favoritoId || !titulo) {
      return res.status(400).json({ message: "ID e titulo sao obrigatorios" });
    }

    const favorito = await Favorito.findOneAndUpdate(
      { userId: req.userId, livroId: favoritoId },
      {
        userId: req.userId,
        livroId: favoritoId,
        titulo,
        thumbnail,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Livro adicionado aos favoritos!", favorito });
  } catch (error) {
    res.status(500).json({ message: "Erro interno", error: error.message });
  }
};

export const getFavoritos = async (req, res) => {
  try {
    const favoritos = await Favorito.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ message: "Erro interno", error: error.message });
  }
};

export const deleteFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const favorito = await Favorito.findOneAndDelete({ _id: id, userId: req.userId });

    if (!favorito) {
      return res.status(404).json({ message: "Livro nao encontrado nos favoritos" });
    }

    res.json({ message: "Livro removido dos favoritos!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno", error: error.message });
  }
};
