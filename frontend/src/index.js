import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter , Routes, Route } from 'react-router-dom' 
import { AuthProvider } from './contextos/AuthContext';
import Header from './componentes/Header';
import Home from './rotas/Home';
import Favoritos from './rotas/favoritos';
import Calendario from './rotas/calendario';
import Register from './rotas/registro';
import Login from './rotas/login';
import EstanteLivros from './rotas/estanteLivros';
import Perfil from './rotas/perfil';

const GlobalStyle = createGlobalStyle
   ` body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }    
      li{
        list-style:none;
      }
        `
 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle/>
    <AuthProvider>
    <BrowserRouter>
     <Header/>
      <Routes>
        
          <Route path="/" element={  <Home />}/>
          <Route path="/cadastre-se" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/perfil" element={<Perfil/>}/>
          <Route path="/favoritos" element={<Favoritos/>}/>
          <Route path="/calendario" element={<Calendario/>}/>
          <Route path="/estante" element={<EstanteLivros/>}/>


      </Routes>
    
    
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
//aqui e feito a importacao do reac router dom para estabelecer as rotas
//lembrando de colocar browser router primeiro, router segundo e route em terceiro
//ja com as especificacoes de rota e elemento
// pegamos o componente de cabecalho e colocamos aqui para
//que ele exista em todas as paginas




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
