import styled from "styled-components";
import api from "../../servicos/api";
import { colors } from "../../styles/theme";

const Button = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.text};
  padding: 12px 16px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background: ${colors.primarySoft};
    color: ${colors.primaryHover};
    transform: translateY(-1px);
  }
`;

function ConectarGoogle({ className }) {
  const conectarGoogle = async () => {
    try {
      const response = await api.get("/auth/google/url");
      window.location.href = response.data.url;
    } catch (error) {
      alert("Nao foi possivel conectar ao Google Calendar");
    }
  };

  return (
    <Button className={className} type="button" onClick={conectarGoogle}>
      Conectar Google Calendar
    </Button>
  );
}

export default ConectarGoogle;
