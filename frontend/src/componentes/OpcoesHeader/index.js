import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contextos/AuthContext";
import { colors } from "../../styles/theme";

const Opcoes = styled.ul`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Item = styled.li`
  display: flex;
`;

const NavLink = styled(Link)`
  padding: 10px 14px;
  border-radius: 999px;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: background 160ms ease, color 160ms ease, transform 160ms ease;

  &:hover {
    background: ${colors.surfaceAlt};
    color: ${colors.primaryHover};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${colors.primarySoft};
    outline-offset: 3px;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceAlt};
  color: ${colors.text};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${colors.primarySoft};
    color: ${colors.primaryHover};
  }
`;

function OpcoesHeader() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const opcoesNaoLogado = [
    { label: "Cadastre-se", path: "/cadastre-se" },
    { label: "Login", path: "/login" },
  ];

  const opcoesLogado = [
    { label: "Perfil", path: "/perfil" },
    { label: "Favoritos", path: "/favoritos" },
    { label: "Calendario", path: "/calendario" },
    { label: "Estante", path: "/estante" },
  ];

  return (
    <Opcoes>
      {!isLoggedIn && opcoesNaoLogado.map((opcao) => (
        <Item key={opcao.path}>
          <NavLink to={opcao.path}>{opcao.label}</NavLink>
        </Item>
      ))}

      {isLoggedIn && opcoesLogado.map((opcao) => (
        <Item key={opcao.path}>
          <NavLink to={opcao.path}>{opcao.label}</NavLink>
        </Item>
      ))}

      {isLoggedIn && (
        <Item>
          <LogoutButton type="button" onClick={handleLogout}>
            Logout
          </LogoutButton>
        </Item>
      )}
    </Opcoes>
  );
}

export default OpcoesHeader;
