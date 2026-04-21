import styled from "styled-components"
import {Link, useNavigate}from 'react-router-dom'
import { useAuth } from '../../contextos/AuthContext';




const Opcao = styled.li`
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    padding: 0 5px;
    cursor: pointer;
    min-width: 120px;
`

const Opcoes = styled.ul`
    display: flex;
`


function OpcoesHeader() {
//aqui vai usar o contexto no lugar de usar useState local
    const {isLoggedIn, logout} =useAuth();
    const navigate = useNavigate();


   // Função para fazer logout pegando a funcao do contexto criado em contextos
   function handleLogout() {
    logout();
    navigate("/login"); // redireciona para login
  }

  // Opções no meu para quando quando NÃO está logado e quando
  const opcoesNaoLogado = ['CADASTRE-SE', 'LOGIN'];
  const opcoesLogado = ['PERFIL','FAVORITOS','CALENDARIO','ESTANTE'];



    return(
        <Opcoes>
        {/* Se NÃO está logado, mostra as opcoes de nao logado */}
        {!isLoggedIn && opcoesNaoLogado.map((texto) => (
          <Link key={texto} to={`/${texto.toLowerCase()}`}>
            <Opcao><p>{texto}</p></Opcao>
          </Link>
        ))}
             {/* Se ESTÁ logado, mostra as opcoes para loggado */}
      {isLoggedIn && opcoesLogado.map((texto) => (
        <Link key={texto} to={`/${texto.toLowerCase()}`}>
          <Opcao><p>{texto}</p></Opcao>
        </Link>
      ))}

      {/* Se ESTÁ logado, mostra botão de LOGOUT (sem Link, só onClick) */}
      {isLoggedIn && (
        <Opcao onClick={handleLogout}>
          <p>LOGOUT</p>
        </Opcao>
      )}
    </Opcoes>
  );
}
  

export default OpcoesHeader