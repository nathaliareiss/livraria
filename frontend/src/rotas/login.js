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
  width: min(100%, 460px);
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
  display: flex;
  flex-direction: column;
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
      setErro(err.response?.data?.mensagem || "Failed to sign in.");
    }
  }

  return (
    <PageShell>
      <Center>
        <AuthCard>
          <Title>Sign in</Title>
          <Subtitle>Access your library and continue tracking books, favorites, and events.</Subtitle>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <ErrorText>{erro}</ErrorText>}

            <PrimaryButton type="submit">Sign in</PrimaryButton>
          </Form>
        </AuthCard>
      </Center>
    </PageShell>
  );
}
