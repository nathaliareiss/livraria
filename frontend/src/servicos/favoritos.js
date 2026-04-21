import api from "./api";

async function getFavoritos() {
  const response = await api.get("/favoritos");
  return response.data;
}

async function postFavorito(livro) {
  const payload = {
    id: livro.id || livro._id || Date.now().toString(),
    titulo: livro.titulo || livro.nome,
    thumbnail: livro.thumbnail,
  };

  const response = await api.post("/favoritos", payload);
  return response.data;
}

async function deleteFavorito(id) {
  const response = await api.delete(`/favoritos/${id}`);
  return response.data;
}

export {
  getFavoritos,
  postFavorito,
  deleteFavorito,
};
