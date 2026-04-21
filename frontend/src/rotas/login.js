import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextos/AuthContext";
import styled from "styled-components";
import api from "../servicos/api";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;
const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  color: #fff;
`;
const Titulo = styled.h2`
  color: #FFF;
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }
`;
const Botao = styled.button`
  background-color: #cd76cc;
  color: #111011;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #d14ccf;
  }
`;
const Erro = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin: 0;
  font-size: 14px;
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const res = await api.post("/login", {
        email,
        senha,
      });

      login(res.data.token, res.data.user);
      navigate("/estante");
    } catch (err) {
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao fazer login");
      }
    }
  }

  return (
    <AppContainer>
      <Card>
        <Titulo>Entrar</Titulo>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && <Erro>{erro}</Erro>}

          <Botao type="submit">Entrar</Botao>
        </Form>
      </Card>
    </AppContainer>
  );
}
