import { useEffect, useState } from "react";
import styled from "styled-components";
import { deleteFavorito, getFavoritos } from "../servicos/favoritos";
import livroImg from "../componentes/imagens/livro.png";
import { PageShell, PageSection, SurfaceCard, SecondaryButton } from "../componentes/ui";
import { colors } from "../styles/theme";

const Wrapper = styled(PageSection)`
  padding: 40px 0 56px;
`;

const Title = styled.h1`
  margin: 0 0 28px;
  text-align: center;
  font-size: clamp(30px, 4vw, 44px);
  letter-spacing: -0.04em;
`;

const ResultadoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
`;

const Resultado = styled(SurfaceCard)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  text-align: left;
  color: ${colors.text};
`;

const Capa = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 16px;
`;

const Empty = styled(SurfaceCard)`
  padding: 28px;
  text-align: center;
  color: ${colors.muted};
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
      setErro("Could not load your favorites.");
    } finally {
      setCarregando(false);
    }
  }

  async function deletaFavorito(id) {
    try {
      await deleteFavorito(id);
      await fetchFavoritos();
    } catch (error) {
      setErro("Could not remove this favorite.");
    }
  }

  useEffect(() => {
    fetchFavoritos();
  }, []);

  return (
    <PageShell>
      <Wrapper>
        <Title>Favorite books</Title>
        {erro && <p style={{ color: colors.danger, textAlign: "center" }}>{erro}</p>}
        {carregando && <p style={{ color: colors.muted, textAlign: "center" }}>Loading favorites...</p>}

        {!carregando && favoritos.length === 0 ? (
          <Empty>You have not saved any favorites yet.</Empty>
        ) : (
          <ResultadoContainer>
            {favoritos.map((favorito) => (
              <Resultado key={favorito._id}>
                <Capa src={favorito.thumbnail || livroImg} alt={`Cover of ${favorito.titulo}`} />
                <h2 style={{ margin: 0, fontSize: 18 }}>{favorito.titulo}</h2>
                <SecondaryButton type="button" onClick={() => deletaFavorito(favorito._id)}>
                  Remove
                </SecondaryButton>
              </Resultado>
            ))}
          </ResultadoContainer>
        )}
      </Wrapper>
    </PageShell>
  );
}

export default Favoritos;
