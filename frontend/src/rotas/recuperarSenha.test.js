import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import RecuperarSenha from "./recuperarSenha";
import api from "../servicos/api";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href: to, ...props }, children);
  },
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("../servicos/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("RecuperarSenha", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    api.post.mockReset();
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("envia o codigo, valida e redefine a senha", async () => {
    api.post.mockImplementation((url) => {
      if (url === "/esqueci-minha-senha") {
        return Promise.resolve({
          data: {
            mensagem: "Se o email estiver cadastrado, um codigo de recuperacao foi enviado para sua caixa de entrada.",
          },
        });
      }

      if (url === "/validar-codigo-recuperacao") {
        return Promise.resolve({
          data: {
            mensagem: "Codigo validado com sucesso",
          },
        });
      }

      if (url === "/redefinir-senha") {
        return Promise.resolve({
          data: {
            mensagem: "Senha alterada com sucesso",
          },
        });
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });

    render(<RecuperarSenha />);

    fireEvent.change(screen.getByPlaceholderText(/email cadastrado/i), {
      target: { value: "nathalia@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar codigo/i }));

    expect(await screen.findByText(/codigo de recuperacao foi enviado/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/codigo de recuperacao/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/codigo de recuperacao/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /validar codigo/i }));

    expect(await screen.findByText(/codigo validado com sucesso/i)).toBeInTheDocument();
    const passwordInputs = screen.getAllByPlaceholderText(/nova senha/i);
    const [novaSenhaInput, confirmarSenhaInput] = passwordInputs;

    expect(novaSenhaInput).toBeInTheDocument();
    expect(confirmarSenhaInput).toBeInTheDocument();

    fireEvent.change(novaSenhaInput, {
      target: { value: "nova-senha123" },
    });

    fireEvent.change(confirmarSenhaInput, {
      target: { value: "nova-senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /atualizar senha/i }));

    expect(await screen.findByText(/senha atualizada com sucesso/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1200);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(api.post).toHaveBeenNthCalledWith(1, "/esqueci-minha-senha", {
      email: "nathalia@example.com",
    });
    expect(api.post).toHaveBeenNthCalledWith(2, "/validar-codigo-recuperacao", {
      email: "nathalia@example.com",
      recoveryCode: "123456",
    });
    expect(api.post).toHaveBeenNthCalledWith(3, "/redefinir-senha", {
      email: "nathalia@example.com",
      recoveryCode: "123456",
      novaSenha: "nova-senha123",
      confirmarSenha: "nova-senha123",
    });
  });

  it("mostra erro quando nao consegue enviar o codigo", async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          mensagem: "Nao foi possivel gerar o codigo de recuperacao.",
        },
      },
    });

    render(<RecuperarSenha />);

    fireEvent.change(screen.getByPlaceholderText(/email cadastrado/i), {
      target: { value: "nathalia@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar codigo/i }));

    expect(await screen.findByText(/nao foi possivel gerar o codigo de recuperacao/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
