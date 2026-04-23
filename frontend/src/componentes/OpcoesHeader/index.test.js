import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OpcoesHeader from ".";
import { useAuth } from "../../contextos/AuthContext";

const mockNavigate = jest.fn();

jest.mock("../../contextos/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actualRouterDom = jest.requireActual("react-router-dom");

  return {
    ...actualRouterDom,
    useNavigate: () => mockNavigate,
  };
});

describe("OpcoesHeader", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useAuth.mockReset();
  });

  it("exibe a home e as opcoes de acesso quando nao esta logado", () => {
    useAuth.mockReturnValue({
      isLoggedIn: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <OpcoesHeader />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/cadastre-se");
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "/login");
  });

  it("exibe as opcoes autenticadas e faz logout indo para login", () => {
    const logout = jest.fn();

    useAuth.mockReturnValue({
      isLoggedIn: true,
      logout,
    });

    render(
      <MemoryRouter>
        <OpcoesHeader />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute("href", "/perfil");
    expect(screen.getByRole("link", { name: /calendar/i })).toHaveAttribute("href", "/calendario");
    expect(screen.getByRole("link", { name: /library/i })).toHaveAttribute("href", "/estante");

    fireEvent.click(screen.getByRole("button", { name: /log out/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
