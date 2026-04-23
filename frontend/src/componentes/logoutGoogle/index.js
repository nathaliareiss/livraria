import styled from "styled-components";
import api from "../../servicos/api";
import { colors } from "../../styles/theme";

const Button = styled.button.attrs({ className: "calendar-google-button" })`
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

function DesconectarGoogle({ className, onDesconectado }) {
  const desconectar = async () => {
    try {
      const res = await api.delete("/auth/google");

      if (res.status >= 200 && res.status < 300) {
        onDesconectado?.();
      }
    } catch (error) {
      alert(error.response?.data?.erro || "Could not disconnect Google Calendar");
    }
  };

  return (
    <Button className={className} type="button" onClick={desconectar}>
      Disconnect Google Calendar
    </Button>
  );
}

export default DesconectarGoogle;
