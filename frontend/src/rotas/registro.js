import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextos/AuthContext";
import styled from "styled-components";
import api from "../servicos/api";
import { colors } from "../styles/theme";
import { PageShell, PageSection, SurfaceCard, PrimaryButton } from "../componentes/ui";

const Center = styled(PageSection)`
  min-height: calc(100vh - 78px);
  display: grid;
  place-items: center;
  padding: 32px 0 56px;
`;

const AuthCard = styled(SurfaceCard)`
  width: min(100%, 520px);
  padding: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 34px;
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  margin: 0 0 28px;
  color: ${colors.muted};
  line-height: 1.6;
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceAlt};
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  color: ${colors.text};

  &::placeholder {
    color: ${colors.subtle};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px ${colors.primarySoft};
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${colors.danger};
  font-size: 14px;
`;

const SuccessText = styled.p`
  margin: 0;
  color: ${colors.success};
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
      setErro("Passwords do not match.");
      return;
    }

    if (senha.length < 8) {
      setErro("Password must have at least 8 characters.");
      return;
    }

    if (!dataNascimento) {
      setErro("Please provide your date of birth.");
      return;
    }

    try {
      const res = await api.post("/cadastre-se", {
        nome,
        email,
        senha,
        dataNascimento,
      });

      setSucesso("Account created successfully.");

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
      setErro(err.response?.data?.mensagem || "Unexpected error while creating the account.");
    }
  }

  return (
    <PageShell>
      <Center>
        <AuthCard>
          <Title>Create account</Title>
          <Subtitle>Sign up to save books, build your library, and organize your reading routine.</Subtitle>

          <Form onSubmit={handleSubmit}>
            <Input name="nome" placeholder="Name" value={form.nome} onChange={handleChange} />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <Input
              name="dataNascimento"
              type="date"
              value={form.dataNascimento}
              onChange={handleChange}
            />
            <Input
              name="senha"
              type="password"
              placeholder="Password"
              value={form.senha}
              onChange={handleChange}
            />
            <Input
              name="confirmarSenha"
              type="password"
              placeholder="Confirm password"
              value={form.confirmarSenha}
              onChange={handleChange}
            />

            {erro && <ErrorText>{erro}</ErrorText>}
            {sucesso && <SuccessText>{sucesso}</SuccessText>}

            <PrimaryButton type="submit">Create account</PrimaryButton>
          </Form>
        </AuthCard>
      </Center>
    </PageShell>
  );
}
