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
  color: rgba(255, 255, 255, 0.76);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.6;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  width: min(100%, 680px);
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
        <Titulo>Explore livros com uma experiência limpa e objetiva.</Titulo>
        <Subtitulo>
          Busque títulos, organize sua estante, salve favoritos e acompanhe suas leituras em um layout pensado para clareza e profissionalismo.
        </Subtitulo>

        <SearchBar>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Busque um livro"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <SearchButton type="submit">Pesquisar</SearchButton>
          </Form>
        </SearchBar>
      </Hero>
    </PesquisaContainer>
  );
}

export default Pesquisa;
