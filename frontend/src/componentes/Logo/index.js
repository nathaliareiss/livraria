import logo from "../imagens/logo.png";
import styled from "styled-components";
import { colors } from "../../styles/theme";

const LogoContainer = styled.div.attrs({ className: "brand-logo" })`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${colors.text};
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const LogoImage = styled.img.attrs({ className: "brand-logo-image" })`
  width: 38px;
  height: 38px;
`;

function Logo() {
  return (
    <LogoContainer>
      <LogoImage src={logo} alt="Livraria" />
      <span className="brand-logo-text">Livraria</span>
    </LogoContainer>
  );
}

export default Logo;
