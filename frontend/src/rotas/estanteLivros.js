import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../servicos/api";
import { iniciarLeitura, finalizarLeitura } from "../servicos/livros";
import { PageShell, PageSection, SurfaceCard, PrimaryButton, SecondaryButton } from "../componentes/ui";
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

const Secao = styled.section`
  margin-bottom: 40px;
`;

const SecaoTitulo = styled.h2`
  color: ${colors.text};
  font-size: 22px;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
`;

const LivrosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
`;

const LivroCard = styled(SurfaceCard)`
  padding: 20px;
  text-align: center;

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 14px;
  }

  h4 {
    font-size: 18px;
    margin: 10px 0;
    color: ${colors.text};
  }

  p {
    font-size: 14px;
    color: ${colors.muted};
    margin-bottom: 15px;
  }
`;

const Empty = styled.p`
  color: ${colors.muted};
  margin: 0;
`;

function EstanteLivros() {
  const [estante, setEstante] = useState({
    favoritos: [],
    lendo: [],
    lidos: [],
    queroLer: [],
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarEstante() {
    try {
      setLoading(true);
      setErro("");
      const response = await api.get("/estante");
      setEstante(response.data);
    } catch (err) {
      setErro("Failed to load your library.");
    } finally {
      setLoading(false);
    }
  }

  async function handleIniciarLeitura(livroId) {
    try {
      await iniciarLeitura(livroId);
      carregarEstante();
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Failed to start reading.");
    }
  }

  async function handleFinalizarLeitura(livroId) {
    try {
      await finalizarLeitura(livroId);
      carregarEstante();
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Failed to finish reading.");
    }
  }

  useEffect(() => {
    carregarEstante();
  }, []);

  if (loading) {
    return (
      <PageShell>
        <Wrapper>
          <Title>Loading library...</Title>
        </Wrapper>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Wrapper>
        <Title>My library</Title>
        {erro && <p style={{ color: colors.danger, textAlign: "center" }}>{erro}</p>}

        <Secao>
          <SecaoTitulo>Favorites</SecaoTitulo>
          <LivrosGrid>
            {estante.favoritos.length > 0 ? (
              estante.favoritos.map((livro) => (
                <LivroCard key={livro._id}>
                  {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                  <h4>{livro.titulo}</h4>
                  <p>{livro.autores?.join(", ") || "Unknown author"}</p>
                  {livro.statusLeitura !== "lendo" && livro.statusLeitura !== "lido" && (
                    <PrimaryButton type="button" onClick={() => handleIniciarLeitura(livro._id)}>
                      Start reading
                    </PrimaryButton>
                  )}
                </LivroCard>
              ))
            ) : (
              <Empty>No favorites yet.</Empty>
            )}
          </LivrosGrid>
        </Secao>

        <Secao>
          <SecaoTitulo>Reading</SecaoTitulo>
          <LivrosGrid>
            {estante.lendo.length > 0 ? (
              estante.lendo.map((livro) => (
                <LivroCard key={livro._id}>
                  {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                  <h4>{livro.titulo}</h4>
                  <p>{livro.autores?.join(", ") || "Unknown author"}</p>
                  <SecondaryButton type="button" onClick={() => handleFinalizarLeitura(livro._id)}>
                    Finish reading
                  </SecondaryButton>
                </LivroCard>
              ))
            ) : (
              <Empty>No books are being read right now.</Empty>
            )}
          </LivrosGrid>
        </Secao>

        <Secao>
          <SecaoTitulo>Finished</SecaoTitulo>
          <LivrosGrid>
            {estante.lidos.length > 0 ? (
              estante.lidos.map((livro) => (
                <LivroCard key={livro._id}>
                  {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                  <h4>{livro.titulo}</h4>
                  <p>{livro.autores?.join(", ") || "Unknown author"}</p>
                  {livro.dataFimLeitura && (
                    <p style={{ fontSize: 12, color: colors.subtle }}>
                      Finished on: {new Date(livro.dataFimLeitura).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </LivroCard>
              ))
            ) : (
              <Empty>No books finished yet.</Empty>
            )}
          </LivrosGrid>
        </Secao>

        <Secao>
          <SecaoTitulo>Want to read</SecaoTitulo>
          <LivrosGrid>
            {estante.queroLer.length > 0 ? (
              estante.queroLer.map((livro) => (
                <LivroCard key={livro._id}>
                  {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                  <h4>{livro.titulo}</h4>
                  <p>{livro.autores?.join(", ") || "Unknown author"}</p>
                  <PrimaryButton type="button" onClick={() => handleIniciarLeitura(livro._id)}>
                    Start reading
                  </PrimaryButton>
                </LivroCard>
              ))
            ) : (
              <Empty>No books in the Want to Read list.</Empty>
            )}
          </LivrosGrid>
        </Secao>
      </Wrapper>
    </PageShell>
  );
}

export default EstanteLivros;
