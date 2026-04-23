import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../servicos/api";
import { useAuth } from "../contextos/AuthContext";
import { PageShell, PageSection, SurfaceCard, PrimaryButton, SecondaryButton } from "../componentes/ui";
import { colors } from "../styles/theme";

const Wrapper = styled(PageSection)`
  padding: 40px 0 56px;
`;

const Layout = styled.div`
  width: min(100%, 960px);
  margin: 0 auto;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(SurfaceCard)`
  padding: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(30px, 4vw, 44px);
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  margin: 0 0 24px;
  color: ${colors.muted};
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  letter-spacing: -0.02em;
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(${(props) => props.$columns || 1}, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 13px;
  color: ${colors.subtle};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
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

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${(props) => (props.$tone === "error" ? colors.danger : colors.success)};
`;

const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 4px 0;
`;

const Summary = styled.div`
  display: grid;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.accent || "#ff8c42"});
  color: white;
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
`;

const Stat = styled.div`
  padding: 16px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceAlt};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${colors.subtle};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: 16px;
  color: ${colors.text};
  word-break: break-word;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

function toDateInputValue(date) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  const localDate = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function formatarData(data) {
  if (!data) return "Not provided";
  const parsed = new Date(data);
  if (Number.isNaN(parsed.getTime())) return "Not provided";
  return parsed.toLocaleDateString("pt-BR");
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "Not provided";

  const nascimento = new Date(dataNascimento);
  if (Number.isNaN(nascimento.getTime())) return "Not provided";

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return `${idade} years old`;
}

function getInitials(nome) {
  if (!nome) return "?";
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function buildFormFromUser(userData) {
  return {
    nome: userData?.nome || "",
    email: userData?.email || "",
    dataNascimento: toDateInputValue(userData?.dataNascimento),
  };
}

export default function Perfil() {
  const { user: authUser, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(() => authUser || null);
  const [form, setForm] = useState(() => buildFormFromUser(authUser));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    if (authUser) {
      setProfile(authUser);
      setForm(buildFormFromUser(authUser));
    }

    async function carregarPerfil() {
      try {
        const res = await api.get("/perfil", {
          params: authUser?.id ? { userId: authUser.id } : undefined,
        });
        if (!active) return;

        const userData = res.data.user;
        setProfile(userData);
        setForm(buildFormFromUser(userData));
      } catch (err) {
        if (!active) return;

        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        setErro(
          err.response?.data?.mensagem ||
            "Nao foi possivel carregar seu perfil. Mostrando os dados salvos localmente."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      active = false;
    };
  }, [authUser, logout, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setErro("");
    setSucesso("");
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function resetForm() {
    if (!profile) return;

    setForm({
      nome: profile.nome || "",
      email: profile.email || "",
      dataNascimento: toDateInputValue(profile.dataNascimento),
    });
    setErro("");
    setSucesso("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setSaving(true);

    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        userId: profile.id || authUser?.id,
      };

      if (form.dataNascimento) {
        payload.dataNascimento = form.dataNascimento;
      }

      const res = await api.put("/perfil", payload);
      const updatedUser = res.data.user;

      setProfile(updatedUser);
      setForm({
        nome: updatedUser.nome || "",
        email: updatedUser.email || "",
        dataNascimento: toDateInputValue(updatedUser.dataNascimento),
      });
      updateUser(updatedUser);
      setSucesso("Perfil atualizado com sucesso.");
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setErro(err.response?.data?.mensagem || "Nao foi possivel atualizar seu perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <Wrapper>
          <Card>
            <Title>Loading profile...</Title>
          </Card>
        </Wrapper>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell>
        <Wrapper>
          <Card>
            <Title>My profile</Title>
            {erro && <Message $tone="error">{erro}</Message>}
            {!erro && <Message $tone="error">Nao foi possivel carregar seu perfil.</Message>}
          </Card>
        </Wrapper>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Wrapper>
        <Layout>
          <Card>
            <Title>My profile</Title>
            <Subtitle>Atualize seus dados cadastrais e mantenha seu perfil sincronizado com a conta.</Subtitle>

            {erro && <Message $tone="error">{erro}</Message>}
            {sucesso && <Message>{sucesso}</Message>}

            <Divider />

            <SectionTitle>Edit information</SectionTitle>

            <Form onSubmit={handleSubmit}>
              <FieldGrid $columns={2}>
                <Field>
                  <Label>Name</Label>
                  <Input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </Field>

                <Field>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    autoComplete="email"
                  />
                </Field>
              </FieldGrid>

              <FieldGrid $columns={2}>
                <Field>
                  <Label>Date of birth</Label>
                  <Input
                    name="dataNascimento"
                    type="date"
                    value={form.dataNascimento}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <Label>Age preview</Label>
                  <Input value={calcularIdade(form.dataNascimento)} readOnly />
                </Field>
              </FieldGrid>

              <ButtonRow>
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={resetForm} disabled={saving}>
                  Reset form
                </SecondaryButton>
                <SecondaryButton type="button" onClick={handleLogout} disabled={saving}>
                  Sign out
                </SecondaryButton>
              </ButtonRow>
            </Form>
          </Card>

          <Card>
            <Summary>
              <Avatar aria-hidden="true">{getInitials(profile.nome)}</Avatar>

              <Stat>
                <StatLabel>Name</StatLabel>
                <StatValue>{profile.nome}</StatValue>
              </Stat>

              <Stat>
                <StatLabel>Email</StatLabel>
                <StatValue>{profile.email}</StatValue>
              </Stat>

              <Stat>
                <StatLabel>Date of birth</StatLabel>
                <StatValue>{formatarData(profile.dataNascimento)}</StatValue>
              </Stat>

              <Stat>
                <StatLabel>Age</StatLabel>
                <StatValue>{calcularIdade(profile.dataNascimento)}</StatValue>
              </Stat>

              <Stat>
                <StatLabel>User ID</StatLabel>
                <StatValue>{profile.id}</StatValue>
              </Stat>
            </Summary>
          </Card>
        </Layout>
      </Wrapper>
    </PageShell>
  );
}
