import { useEffect, useState } from "react";
import styled from "styled-components";
import { deleteFavorito, getFavoritos } from "../servicos/favoritos";
import livroImg from "../componentes/imagens/livro.png";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
`;

const ResultadoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Resultado = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
  cursor: pointer;
  text-align: left;
  padding: 16px 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;

  p {
    width: 200px;
    margin: 0;
  }

  img {
    width: 88px;
  }

  &:hover {
    border-color: white;
  }
`;

const Titulo = styled.h2`
  color: #FFF;
  font-size: 36px;
  text-align: center;
  width: 100%;
  padding-top: 35px;
`;

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function fetchFavoritos() {
    try {
      setErro("");
      setCarregando(true);
      const favoritosDaAPI = await getFavoritos();
      setFavoritos(favoritosDaAPI);
    } catch (error) {
      setErro("Nao foi possivel carregar seus favoritos.");
    } finally {
      setCarregando(false);
    }
  }

  async function deletaFavorito(id) {
    try {
      await deleteFavorito(id);
      await fetchFavoritos();
    } catch (error) {
      setErro("Nao foi possivel remover este favorito.");
    }
  }

  useEffect(() => {
    fetchFavoritos();
  }, []);

  return (
    <AppContainer>
      <div>
        <Titulo>Aqui estao seus livros favoritos:</Titulo>
        {erro && <p style={{ color: "#ffb3b3", textAlign: "center" }}>{erro}</p>}
        {carregando && <p style={{ color: "#fff", textAlign: "center" }}>Carregando favoritos...</p>}
        <ResultadoContainer>
          {!carregando && favoritos.length === 0 && (
            <p style={{ color: "#fff" }}>Nenhum favorito salvo ainda.</p>
          )}
          {favoritos.map((favorito) => (
            <Resultado key={favorito._id} type="button" onClick={() => deletaFavorito(favorito._id)}>
              <p>{favorito.titulo}</p>
              <img src={favorito.thumbnail || livroImg} alt={`Capa de ${favorito.titulo}`} />
            </Resultado>
          ))}
        </ResultadoContainer>
      </div>
    </AppContainer>
  );
}

export default Favoritos;
