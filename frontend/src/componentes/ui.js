import styled from "styled-components";
import { colors } from "../styles/theme";

export const PageShell = styled.main.attrs({ className: "page-shell" })`
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(29, 78, 216, 0.06), transparent 28%),
    linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%);
  color: ${colors.text};
`;

export const PageSection = styled.section.attrs({ className: "page-section" })`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
`;

export const SurfaceCard = styled.div.attrs({ className: "surface-card" })`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 24px;
  box-shadow: ${colors.shadowSoft};
`;

export const PrimaryButton = styled.button.attrs({ className: "primary-button" })`
  border: 1px solid transparent;
  border-radius: 14px;
  background: ${colors.primary};
  color: #fff;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${colors.primarySoft};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled(PrimaryButton).attrs({ className: "secondary-button" })`
  background: ${colors.surfaceAlt};
  color: ${colors.text};
  border-color: ${colors.border};

  &:hover:not(:disabled) {
    background: ${colors.primarySoft};
    color: ${colors.primaryHover};
  }
`;
