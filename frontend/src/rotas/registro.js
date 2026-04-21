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

export default function Register() {
  const [form, setForm] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const { nome, email, senha, confirmarSenha, dataNascimento } = form;

    if (senha !== confirmarSenha) {
      setErro("As senhas nao conferem.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (!dataNascimento) {
      setErro("Informe sua data de nascimento.");
      return;
    }

    try {
      const res = await api.post("/cadastre-se", {
        nome,
        email,
        senha,
        dataNascimento,
      });

      setSucesso("Cadastro realizado com sucesso!");

      if (res.data.token) {
        login(res.data.token, res.data.user);
        navigate("/estante");
        return;
      }

      setForm({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        dataNascimento: "",
      });
    } catch (err) {
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro inesperado ao cadastrar");
      }
    }
  }

  return (
    <AppContainer>
      <Card>
        <Titulo>Cadastro</Titulo>

        <Form onSubmit={handleSubmit}>
          <Input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input
            name="dataNascimento"
            type="date"
            placeholder="Data de nascimento"
            value={form.dataNascimento}
            onChange={handleChange}
          />
          <Input
            name="senha"
            type="password"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
          />
          <Input
            name="confirmarSenha"
            type="password"
            placeholder="Confirme a senha"
            value={form.confirmarSenha}
            onChange={handleChange}
          />

          {erro && <Erro>{erro}</Erro>}
          {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

          <Botao type="submit">Cadastrar</Botao>
        </Form>
      </Card>
    </AppContainer>
  );
}
