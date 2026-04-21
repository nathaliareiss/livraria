import perfil from "../imagens/perfil.png";
import sacola from "../imagens/sacola.png";
import styled from "styled-components";
import { colors } from "../../styles/theme";

const Icone = styled.li`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceAlt};
`;

const Icones = styled.ul`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const icones = [
  { src: perfil, alt: "Perfil" },
  { src: sacola, alt: "Sacola" },
];

function IconesHeader() {
  return (
    <Icones>
      {icones.map((icone) => (
        <Icone key={icone.alt}>
          <img src={icone.src} alt={icone.alt} width="20" height="20" />
        </Icone>
      ))}
    </Icones>
  );
}

export default IconesHeader;
