import styled from "styled-components";
import { Titulo } from "../titulo";
import { colors } from "../../styles/theme";

const Card = styled.div.attrs({ className: "recommendation-card" })`
  align-items: center;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  box-shadow: ${colors.shadowSoft};
  border-radius: 24px;
  display: flex;
  gap: 24px;
  margin: 0 auto;
  max-width: 760px;
  padding: 28px;
  justify-content: space-between;
  width: 100%;
`;

const Botao = styled.button.attrs({ className: "recommendation-button" })`
  background-color: ${colors.primary};
  color: #fff;
  padding: 12px 16px;
  font-size: 15px;
  border: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const Descricao = styled.p.attrs({ className: "recommendation-description" })`
  max-width: 340px;
  color: ${colors.muted};
  line-height: 1.6;
`;

const Subtitulo = styled.h4.attrs({ className: "recommendation-subtitle" })`
  color: ${colors.text};
  font-size: 18px;
  font-weight: 800;
  margin: 15px 0;
`;

const ImgLivro = styled.img.attrs({ className: "recommendation-image" })`
  width: 150px;
  border-radius: 16px;
`;

function CardRecomenda({ titulo, subtitulo, descricao, img }) {
  return (
    <Card>
      <div>
        <Titulo tamanhoFonte="16px" cor={colors.primary} alinhamento="left">{titulo}</Titulo>
        <Subtitulo>{subtitulo}</Subtitulo>
        <Descricao>{descricao}</Descricao>
      </div>
      <div>
        <ImgLivro src={img} alt={titulo} />
        <Botao>Saiba mais</Botao>
      </div>
    </Card>
  );
}

export default CardRecomenda;
