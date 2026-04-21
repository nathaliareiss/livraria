import styled from "styled-components";
import { colors } from "../../styles/theme";

const LivrosContainer = styled.div`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 24px 0 56px;
`;

const LivroCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 22px;
  padding: 20px;
  text-align: center;
  color: ${colors.text};
  box-shadow: ${colors.shadowSoft};

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 16px;
  }

  h3 {
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

const BotoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
`;

const Botao = styled.button`
  background-color: ${colors.surfaceAlt};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.primarySoft};
    color: ${colors.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function UltimosLancamentos({ livros, onAdicionarFavorito, onComecarLer, onQueroLer, loading }) {
  if (!livros || livros.length === 0) {
    return null;
  }

  return (
    <LivrosContainer>
      {livros.map((livro) => (
        <LivroCard key={livro.googleId}>
          {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
          <h3>{livro.titulo}</h3>
          <p>{livro.autores?.join(", ") || "Autor desconhecido"}</p>

          <BotoesContainer>
            <Botao
              onClick={() => onAdicionarFavorito(livro)}
              disabled={loading[`fav_${livro.googleId}`]}
            >
              {loading[`fav_${livro.googleId}`] ? "Adicionando..." : "Favoritar"}
            </Botao>

            <Botao
              onClick={() => onComecarLer(livro)}
              disabled={loading[`ler_${livro.googleId}`]}
            >
              {loading[`ler_${livro.googleId}`] ? "Iniciando..." : "Começar a ler"}
            </Botao>

            <Botao
              onClick={() => onQueroLer(livro)}
              disabled={loading[`queroler_${livro.googleId}`]}
            >
              {loading[`queroler_${livro.googleId}`] ? "Adicionando..." : "Quero ler"}
            </Botao>
          </BotoesContainer>
        </LivroCard>
      ))}
    </LivrosContainer>
  );
}

export default UltimosLancamentos;
