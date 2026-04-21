import styled from "styled-components";
import { colors } from "../../styles/theme";

const Input = styled.input`
  width: 100%;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  color: ${colors.text};
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &::placeholder {
    color: ${colors.subtle};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px ${colors.primarySoft};
  }
`;

export default Input;
