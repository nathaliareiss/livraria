import styled from "styled-components";
import { useState } from "react";
import api from "../servicos/api";
import Pesquisa from "../componentes/Pesquisa";
import UltimosLancamentos from "../componentes/ultimoslancamentos";
import { adicionarLivro, alternarFavorito, alternarQueroLer, iniciarLeitura } from "../servicos/livros";
import { PageShell, SurfaceCard } from "../componentes/ui";
import { colors } from "../styles/theme";

const Content = styled.div`
  padding-bottom: 56px;
`;

const StatusBanner = styled.div`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto 16px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.$kind === "error" ? "#fecaca" : "#bbf7d0")};
  background: ${(props) => (props.$kind === "error" ? "#fef2f2" : "#f0fdf4")};
  color: ${(props) => (props.$kind === "error" ? colors.danger : colors.success)};
  font-weight: 600;
`;

const EmptyState = styled(SurfaceCard)`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto 56px;
  padding: 28px;
  text-align: center;
  color: ${colors.muted};
`;

function Home() {
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState({});
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState("success");

  async function buscarLivros(termo) {
    try {
      setErro("");
      setStatus("");
      const res = await api.get(`/books/search?q=${termo}`);
      setLivros(res.data);
    } catch (err) {
      setErro("Erro ao buscar livros.");
      setStatusKind("error");
      setStatus("Nao foi possivel carregar os resultados agora.");
    }
  }

  async function handleAdicionarFavorito(livroGoogle) {
    try {
      setLoading({ ...loading, [`fav_${livroGoogle.googleId}`]: true });
      const livroAdicionado = await adicionarLivro(livroGoogle);
      await alternarFavorito(livroAdicionado._id);
      setStatusKind("success");
      setStatus("Livro adicionado aos favoritos.");
    } catch (err) {
      setStatusKind("error");
      setStatus(err.response?.data?.mensagem || "Erro ao adicionar aos favoritos.");
    } finally {
      setLoading({ ...loading, [`fav_${livroGoogle.googleId}`]: false });
    }
  }

  async function handleComecarLer(livroGoogle) {
    try {
      setLoading({ ...loading, [`ler_${livroGoogle.googleId}`]: true });
      const livroAdicionado = await adicionarLivro(livroGoogle);
      await iniciarLeitura(livroAdicionado._id);
      setStatusKind("success");
      setStatus("Leitura iniciada e evento preparado.");
    } catch (err) {
      setStatusKind("error");
      setStatus(err.response?.data?.mensagem || "Erro ao iniciar leitura.");
    } finally {
      setLoading({ ...loading, [`ler_${livroGoogle.googleId}`]: false });
    }
  }

  async function handleQueroLer(livroGoogle) {
    try {
      setLoading({ ...loading, [`queroler_${livroGoogle.googleId}`]: true });
      const livroAdicionado = await adicionarLivro(livroGoogle);
      await alternarQueroLer(livroAdicionado._id);
      setStatusKind("success");
      setStatus("Livro adicionado à lista Quero Ler.");
    } catch (err) {
      setStatusKind("error");
      setStatus(err.response?.data?.mensagem || "Erro ao adicionar.");
    } finally {
      setLoading({ ...loading, [`queroler_${livroGoogle.googleId}`]: false });
    }
  }

  return (
    <PageShell>
      <Content>
        <Pesquisa onBuscar={buscarLivros} />

        {status && <StatusBanner $kind={statusKind}>{status}</StatusBanner>}
        {erro && <StatusBanner $kind="error">{erro}</StatusBanner>}

        {livros.length === 0 ? (
          <EmptyState>
            Pesquise um livro para começar a montar sua estante.
          </EmptyState>
        ) : (
          <UltimosLancamentos
            livros={livros}
            onAdicionarFavorito={handleAdicionarFavorito}
            onComecarLer={handleComecarLer}
            onQueroLer={handleQueroLer}
            loading={loading}
          />
        )}
      </Content>
    </PageShell>
  );
}

export default Home;
