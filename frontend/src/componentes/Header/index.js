import styled from "styled-components";
import { Link } from "react-router-dom";
import OpcoesHeader from "../OpcoesHeader";
import Logo from "../Logo";
import { PageSection } from "../ui";
import { colors } from "../../styles/theme";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 1px solid rgba(219, 227, 238, 0.9);
`;

const HeaderInner = styled(PageSection)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 78px;
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  border-radius: 16px;

  &:focus-visible {
    outline: 3px solid ${colors.primarySoft};
    outline-offset: 4px;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <HeaderInner>
        <BrandLink to="/">
          <Logo />
        </BrandLink>

        <OpcoesHeader />
      </HeaderInner>
    </HeaderContainer>
  );
}

export default Header;
