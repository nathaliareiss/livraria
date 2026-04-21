import styled from "styled-components";
import Input from "../Input";
import { useState } from "react";

const PesquisaContainer = styled.section`
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
  color: #FFF;
  text-align: center;
  padding: 85px 0;
  height: 270px;
  width: 100%;
`;

const Titulo = styled.h2`
  color: #FFF;
  font-size: 36px;
  text-align: center;
  width: 100%;
`;

const Subtitulo = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 40px;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 5px 10px;
  width: 250px;
`;

const SearchButton = styled.button`
  background-color: #cd76cc;
  color: #111011;
  border: none;
  padding: 5px;
  border-radius: 17px;
  cursor: pointer;

  &:hover {
    background-color: #d14ccf;
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
      <Titulo>Por onde comecar?</Titulo>
      <Subtitulo>Encontre seu livro em nossa estante</Subtitulo>

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
    </PesquisaContainer>
  );
}

export default Pesquisa;
