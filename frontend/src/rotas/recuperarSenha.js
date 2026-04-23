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
  width: min(100%, 640px);
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

const Stepper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const Step = styled.div`
  padding: 14px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.$active ? colors.primary : colors.border)};
  background: ${(props) => (props.$active ? colors.primarySoft : colors.surfaceAlt)};
  color: ${(props) => (props.$active ? colors.primaryHover : colors.muted)};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
`;

const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.85);
  color: ${colors.primaryHover};
  font-size: 13px;
  font-weight: 800;
`;

const Section = styled.section`
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceAlt};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.02em;
`;

const SectionText = styled.p`
  margin: 0;
  color: ${colors.muted};
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(${(props) => props.$columns || 1}, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
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

const StatusBox = styled.div`
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.$tone === "success" ? "#bbf7d0" : "#fde68a")};
  background: ${(props) => (props.$tone === "success" ? "#f0fdf4" : "#fffbeb")};
  color: ${(props) => (props.$tone === "success" ? colors.success : "#a16207")};
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

const FieldHint = styled.span`
  color: ${colors.muted};
  font-size: 13px;
  line-height: 1.5;
`;

const MessageArea = styled.div`
  margin: 14px 0 4px;
`;

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [etapa, setEtapa] = useState("email");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();

  function resetMensagens() {
    setErro("");
    setSucesso("");
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    if (etapa !== "email") {
      setEtapa("email");
      setCodigo("");
      setNovaSenha("");
      setConfirmarSenha("");
    }
    resetMensagens();
  }

  function handleCodigoChange(e) {
    setCodigo(e.target.value);
    resetMensagens();
  }

  async function enviarCodigo(e) {
    e.preventDefault();
    resetMensagens();
    setLoading("email");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await api.post("/esqueci-minha-senha", { email: normalizedEmail });
      setCodigo("");
      setEtapa("codigo");
      setSucesso(res.data.mensagem || "Se o email estiver cadastrado, o codigo foi enviado.");
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Nao foi possivel gerar o codigo de recuperacao.");
    } finally {
      setLoading("");
    }
  }

  async function validarCodigo(e) {
    e.preventDefault();
    resetMensagens();
    setLoading("codigo");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await api.post("/validar-codigo-recuperacao", {
        email: normalizedEmail,
        recoveryCode: codigo.trim(),
      });

      setEtapa("senha");
      setSucesso("Codigo validado com sucesso. Agora defina sua nova senha.");
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Nao foi possivel validar o codigo.");
    } finally {
      setLoading("");
    }
  }

  async function redefinirSenha(e) {
    e.preventDefault();
    resetMensagens();
    setLoading("senha");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await api.post("/redefinir-senha", {
        email: normalizedEmail,
        recoveryCode: codigo.trim(),
        novaSenha,
        confirmarSenha,
      });

      setSucesso("Senha atualizada com sucesso.");
      setEmail("");
      setCodigo("");
      setNovaSenha("");
      setConfirmarSenha("");
      setEtapa("email");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Nao foi possivel redefinir a senha.");
    } finally {
      setLoading("");
    }
  }

  const isEmailLoading = loading === "email";
  const isCodeLoading = loading === "codigo";
  const isPasswordLoading = loading === "senha";

  return (
    <PageShell>
      <Center>
        <AuthCard>
          <Title>Recover password</Title>
          <Subtitle>First we confirm your email, then the code that arrived by email, and only after that we open the new password fields.</Subtitle>

          <Stepper aria-label="Recovery steps">
            <Step $active={etapa === "email" || etapa === "codigo" || etapa === "senha"}>
              <StepNumber>1</StepNumber>
              Enter your email
            </Step>
            <Step $active={etapa === "codigo" || etapa === "senha"}>
              <StepNumber>2</StepNumber>
              Confirm the code
            </Step>
            <Step $active={etapa === "senha"}>
              <StepNumber>3</StepNumber>
              Reset password
            </Step>
          </Stepper>

          {(erro || sucesso) && (
            <MessageArea>
              {erro && <ErrorText>{erro}</ErrorText>}
              {sucesso && <ErrorText style={{ color: colors.success, marginTop: erro ? 8 : 0 }}>{sucesso}</ErrorText>}
            </MessageArea>
          )}

          <Section>
            <SectionTitle>1. Email</SectionTitle>
            <SectionText>Digite o email cadastrado. Se ele existir, o sistema envia o codigo para a sua caixa de entrada.</SectionText>
            <Form onSubmit={enviarCodigo}>
              <FieldRow>
                <Input
                  type="email"
                  placeholder="Email cadastrado"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                />
              </FieldRow>
              <SecondaryButton type="submit" disabled={isEmailLoading || !email}>
                {isEmailLoading ? "Enviando codigo..." : "Enviar codigo"}
              </SecondaryButton>
            </Form>
          </Section>

          {etapa !== "email" && (
            <Section style={{ marginTop: 16 }}>
              <SectionTitle>2. Codigo</SectionTitle>
              <SectionText>Digite o codigo que chegou no seu email para liberar a redefinicao.</SectionText>
              <Form onSubmit={validarCodigo}>
                <FieldRow>
                  <Input
                    type="text"
                    placeholder="Codigo de recuperacao"
                    value={codigo}
                    onChange={handleCodigoChange}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </FieldRow>
                <SecondaryButton type="submit" disabled={isCodeLoading || !codigo}>
                  {isCodeLoading ? "Validando..." : "Validar codigo"}
                </SecondaryButton>
              </Form>
            </Section>
          )}

          {etapa === "senha" ? (
            <Section style={{ marginTop: 16 }}>
              <SectionTitle>3. Nova senha</SectionTitle>
              <SectionText>Agora voce pode criar uma nova senha com pelo menos 8 caracteres.</SectionText>
              <Form onSubmit={redefinirSenha}>
                <FieldRow $columns={2}>
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    autoComplete="new-password"
                  />
                  <Input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    autoComplete="new-password"
                  />
                </FieldRow>

                <FieldHint>Se quiser, revise o email e o codigo antes de concluir a troca.</FieldHint>

                <PrimaryButton type="submit" disabled={isPasswordLoading || !novaSenha || !confirmarSenha}>
                  {isPasswordLoading ? "Atualizando..." : "Atualizar senha"}
                </PrimaryButton>
              </Form>
            </Section>
          ) : (
            <StatusBox $tone="warning" style={{ marginTop: 16 }}>
              <strong>Campos de senha bloqueados</strong>
              <span>Depois de validar o codigo, os campos de redefinicao aparecem aqui.</span>
            </StatusBox>
          )}

          <div style={{ marginTop: 18 }}>
            <BackLink to="/login">Back to login</BackLink>
          </div>
        </AuthCard>
      </Center>
    </PageShell>
  );
}
