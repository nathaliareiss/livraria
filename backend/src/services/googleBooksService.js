import axios from "axios";

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

export async function buscarLivrosGoogle(query) {
  const response = await axios.get(GOOGLE_BOOKS_URL, {
    params: {
      q: query,
      maxResults: 10
    }
  });

  return response.data.items.map(item => {
    const info = item.volumeInfo;

    return {
      googleId: item.id,
      titulo: info.title,
      autores: info.authors || [],
      editora: info.publisher || "Desconhecida",
      descricao: info.description || "",
      thumbnail: info.imageLinks?.thumbnail || null,
      previewLink: info.previewLink || null
    };
  });
}
