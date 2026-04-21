import perfil from "../imagens/perfil.png";
import sacola from "../imagens/sacola.png";
import styled from "styled-components";

const Icone = styled.li`
  margin-right: 40px;
  width: 25px;
`;

const Icones = styled.ul`
  display: flex;
  align-items: center;
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
          <img src={icone.src} alt={icone.alt} />
        </Icone>
      ))}
    </Icones>
  );
}

export default IconesHeader;
