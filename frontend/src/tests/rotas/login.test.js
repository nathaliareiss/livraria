import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "../../rotas/login";
import api from "../../servicos/api";
import { useAuth } from "../../contextos/AuthContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href: to, ...props }, children);
  },
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("../../contextos/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../servicos/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("Login", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useAuth.mockReset();
    api.post.mockReset();
  });

  it("faz login, salva os dados e vai para a estante", async () => {
    const login = jest.fn();

    useAuth.mockReturnValue({ login });
    api.post.mockResolvedValue({
      data: {
        token: "token-123",
        user: {
          id: "user-1",
          nome: "Nathalia",
          email: "nathalia@example.com",
        },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "nathalia@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/login", {
        email: "nathalia@example.com",
        senha: "12345678",
      });
    });

    expect(login).toHaveBeenCalledWith("token-123", {
      id: "user-1",
      nome: "Nathalia",
      email: "nathalia@example.com",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/estante");
  });

  it("mostra mensagem de erro quando a autenticação falha", async () => {
    useAuth.mockReturnValue({ login: jest.fn() });
    api.post.mockRejectedValue({
      response: {
        data: {
          mensagem: "Email ou senha invalidos",
        },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "nathalia@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "senha-errada" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email ou senha invalidos/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
