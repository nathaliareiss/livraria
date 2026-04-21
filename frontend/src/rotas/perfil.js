import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PageShell, PageSection, SurfaceCard, PrimaryButton } from "../componentes/ui";
import { colors } from "../styles/theme";

const Wrapper = styled(PageSection)`
  padding: 40px 0 56px;
  display: grid;
  place-items: center;
`;

const Card = styled(SurfaceCard)`
  width: min(100%, 640px);
  padding: 32px;
`;

const Title = styled.h1`
  margin: 0 0 24px;
  text-align: center;
  font-size: clamp(30px, 4vw, 44px);
  letter-spacing: -0.04em;
`;

const Info = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: ${colors.surfaceAlt};
  border-radius: 16px;
  border: 1px solid ${colors.border};
`;

const Label = styled.strong`
  display: block;
  font-size: 13px;
  color: ${colors.subtle};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Valor = styled.p`
  font-size: 16px;
  color: ${colors.text};
  margin: 0;
  word-break: break-word;
`;

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  function formatarData(data) {
    if (!data) return "Nao informado";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "Nao informado";

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return `${idade} anos`;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <PageShell>
        <Wrapper>
          <Title>Carregando...</Title>
        </Wrapper>
      </PageShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageShell>
      <Wrapper>
        <Card>
          <Title>Meu perfil</Title>

          <Info>
            <Label>Nome</Label>
            <Valor>{user.nome}</Valor>
          </Info>

          <Info>
            <Label>Email</Label>
            <Valor>{user.email}</Valor>
          </Info>

          <Info>
            <Label>Data de nascimento</Label>
            <Valor>{formatarData(user.dataNascimento)}</Valor>
          </Info>

          <Info>
            <Label>Idade</Label>
            <Valor>{calcularIdade(user.dataNascimento)}</Valor>
          </Info>

          <Info>
            <Label>ID do usuário</Label>
            <Valor>{user.id}</Valor>
          </Info>

          <PrimaryButton type="button" onClick={handleLogout}>
            Sair
          </PrimaryButton>
        </Card>
      </Wrapper>
    </PageShell>
  );
}
