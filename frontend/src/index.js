import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextos/AuthContext";
import Header from "./componentes/Header";
import Home from "./rotas/Home";
import Calendario from "./rotas/calendario";
import Register from "./rotas/registro";
import Login from "./rotas/login";
import RecuperarSenha from "./rotas/recuperarSenha";
import EstanteLivros from "./rotas/estanteLivros";
import Perfil from "./rotas/perfil";
import { colors, typography } from "./styles/theme";

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");

  :root {
    color-scheme: light;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: ${typography.body};
    background: ${colors.background};
    color: ${colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, button, input, textarea, select {
    font-family: ${typography.body};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={{ colors, typography }}>
      <GlobalStyle />
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastre-se" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/estante" element={<EstanteLivros />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
