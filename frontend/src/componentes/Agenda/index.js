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
`;

function Agenda() {
  async function conectarGoogle() {
    try {
      const response = await api.get("/auth/google/url");
      window.location.href = response.data.url;
    } catch (error) {
      alert("Nao foi possivel conectar ao Google Agenda");
    }
  }

  return (
    <div className="calendario">
      <Button type="button" onClick={conectarGoogle}>
        Conectar Google Agenda
      </Button>
    </div>
  );
}

export default Agenda;
