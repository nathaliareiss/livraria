import styled from "styled-components";
import { colors } from "../../styles/theme";

const LivrosContainer = styled.div.attrs({ className: "book-grid" })`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 24px 0 56px;
`;

const LivroCard = styled.div.attrs({ className: "book-card" })`
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

const BotoesContainer = styled.div.attrs({ className: "book-actions" })`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
`;

const Botao = styled.button.attrs({ className: "book-action-button" })`
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

const ButtonContent = styled.span.attrs({ className: "book-action-content" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SuccessBadge = styled.span.attrs({ className: "book-action-badge" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: ${colors.success};
  color: #fff;
  box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.12);
`;

const SuccessLabel = styled.span.attrs({ className: "book-action-label" })`
  color: ${colors.success};
`;

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="M16.25 5.75L8.5 13.5L3.75 8.75"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UltimosLancamentos({
  livros,
  onAdicionarFavorito,
  onComecarLer,
  onQueroLer,
  loading,
  successMarks,
}) {
  if (!livros || livros.length === 0) {
    return null;
  }

  const renderButtonLabel = (action, googleId, idleLabel, loadingLabel) => {
    const key = `${action}_${googleId}`;
    if (successMarks?.[key]) {
      return (
        <ButtonContent>
          <SuccessBadge>
            <CheckIcon />
          </SuccessBadge>
          <SuccessLabel>Added</SuccessLabel>
        </ButtonContent>
      );
    }

    return loadingLabel ? loadingLabel : idleLabel;
  };

  return (
    <LivrosContainer>
      {livros.map((livro) => (
        <LivroCard key={livro.googleId}>
          {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
          <h3>{livro.titulo}</h3>
          <p>{livro.autores?.join(", ") || "Unknown author"}</p>

          <BotoesContainer>
            <Botao
              onClick={() => onAdicionarFavorito(livro)}
              disabled={loading[`fav_${livro.googleId}`]}
            >
              {loading[`fav_${livro.googleId}`]
                ? "Adding..."
                : renderButtonLabel("fav", livro.googleId, "Favorite")}
            </Botao>

            <Botao
              onClick={() => onComecarLer(livro)}
              disabled={loading[`ler_${livro.googleId}`]}
            >
              {loading[`ler_${livro.googleId}`]
                ? "Starting..."
                : renderButtonLabel("ler", livro.googleId, "Start reading")}
            </Botao>

            <Botao
              onClick={() => onQueroLer(livro)}
              disabled={loading[`queroler_${livro.googleId}`]}
            >
              {loading[`queroler_${livro.googleId}`]
                ? "Adding..."
                : renderButtonLabel("queroler", livro.googleId, "Want to read")}
            </Botao>
          </BotoesContainer>
        </LivroCard>
      ))}
    </LivrosContainer>
  );
}

export default UltimosLancamentos;
