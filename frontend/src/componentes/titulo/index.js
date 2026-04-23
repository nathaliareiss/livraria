import styled from "styled-components";
import { colors } from "../../styles/theme";

export const Titulo = styled.h2.attrs({ className: "section-title" })`
  width: 100%;
  margin: 0;
  padding: 0;
  color: ${(props) => props.cor || colors.text};
  font-size: ${(props) => props.tamanhoFonte || "36px"};
  text-align: ${(props) => props.alinhamento || "center"};
  letter-spacing: -0.04em;
`;
