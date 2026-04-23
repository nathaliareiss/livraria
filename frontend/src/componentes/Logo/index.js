import logo from "../imagens/logo.png";
import styled from "styled-components";
import { colors } from "../../styles/theme";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${colors.text};
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const LogoImage = styled.img`
  width: 38px;
  height: 38px;
`;

function Logo() {
  return (
    <LogoContainer>
      <LogoImage src={logo} alt="Livraria" />
      <p><strong>Livraria</strong></p>
    </LogoContainer>
  );
}

export default Logo;
