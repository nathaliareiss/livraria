import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../servicos/api";
import { colors } from "../styles/theme";
import { PageShell, PageSection, SurfaceCard, PrimaryButton, SecondaryButton } from "../componentes/ui";

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
  margin: 0 0 24px;
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

const SuccessBox = styled.div`
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: ${colors.success};
`;

const CodeBox = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px dashed #86efac;
  color: ${colors.success};
  font-weight: 800;
  letter-spacing: 0.15em;
  text-align: center;
`;

const BackLink = styled(Link)`
  color: ${colors.primaryHover};
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [codigoGerado, setCodigoGerado] = useState("");
  const navigate = useNavigate();

  async function gerarCodigo(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const res = await api.post("/esqueci-minha-senha", { email });
      setCodigoGerado(res.data.recoveryCode);
      setCodigo(res.data.recoveryCode);
      setSucesso("Recovery code generated. Use it below to set a new password.");
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Failed to generate recovery code.");
    }
  }

  async function redefinirSenha(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      await api.post("/redefinir-senha", {
        email,
        recoveryCode: codigo,
        novaSenha,
        confirmarSenha,
      });

      setSucesso("Password updated successfully.");
      setEmail("");
      setCodigo("");
      setNovaSenha("");
      setConfirmarSenha("");
      setCodigoGerado("");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Failed to reset password.");
    }
  }

  return (
    <PageShell>
      <Center>
        <AuthCard>
          <Title>Recover password</Title>
          <Subtitle>Generate a recovery code, then use it to create a new password.</Subtitle>

          <Form onSubmit={gerarCodigo}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SecondaryButton type="submit">Generate code</SecondaryButton>
          </Form>

          {codigoGerado && (
            <SuccessBox style={{ marginTop: 16, marginBottom: 16 }}>
              <strong>Your recovery code</strong>
              <CodeBox>{codigoGerado}</CodeBox>
              <span>Copy this code and use it below. It expires in 15 minutes.</span>
            </SuccessBox>
          )}

          <Form onSubmit={redefinirSenha}>
            <Input
              type="text"
              placeholder="Recovery code"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            {erro && <ErrorText>{erro}</ErrorText>}
            {sucesso && <ErrorText style={{ color: colors.success }}>{sucesso}</ErrorText>}

            <PrimaryButton type="submit">Update password</PrimaryButton>
            <BackLink to="/login">Back to login</BackLink>
          </Form>
        </AuthCard>
      </Center>
    </PageShell>
  );
}
