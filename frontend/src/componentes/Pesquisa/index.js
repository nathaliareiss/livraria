import styled from "styled-components";
import Input from "../Input";
import { useState } from "react";
import { colors } from "../../styles/theme";
import { PageSection } from "../ui";

const PesquisaContainer = styled.section`
  padding: 28px 0 16px;
`;

const Hero = styled(PageSection)`
  padding: 40px;
  border-radius: 28px;
  background: linear-gradient(135deg, ${colors.surfaceDark} 0%, ${colors.surfaceDarkAlt} 100%);
  box-shadow: ${colors.shadow};
  color: #fff;
  text-align: center;
`;

const Titulo = styled.h2`
  margin: 0 0 12px;
  color: #fff;
  font-size: clamp(32px, 4vw, 52px);
  letter-spacing: -0.04em;
`;

const Subtitulo = styled.h3`
  margin: 0 0 28px;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.76);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.6;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  width: min(100%, 680px);
  margin: 0 auto;
  align-items: center;
`;

const SearchButton = styled.button`
  background-color: ${colors.primary};
  color: #fff;
  border: 1px solid transparent;
  padding: 14px 18px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-1px);
  }
`;

function Pesquisa({ onBuscar }) {
  const [valor, setValor] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (valor.trim()) {
      onBuscar(valor);
    }
  }

  return (
    <PesquisaContainer>
      <Hero>
        <Titulo>Explore books with a clean and focused experience.</Titulo>
        <Subtitulo>
          Search titles, organize your library, save favorites, and track your reading in a layout built for clarity and professionalism.
        </Subtitulo>

        <SearchBar>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Search for a book"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <SearchButton type="submit">Search</SearchButton>
          </Form>
        </SearchBar>
      </Hero>
    </PesquisaContainer>
  );
}

export default Pesquisa;
