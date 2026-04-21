import OpcoesHeader from '../OpcoesHeader';
import IconesHeader from '../iconesHeader';
import Logo from '../Logo';
import styled from 'styled-components';
import { Link } from 'react-router-dom';



const HeaderContainer = styled.header`
  background-color: rgb(181, 155, 184);
  display:flex;
  justify-content:center
`

// Pra fazer com que quando clicarmos na logo que fica no cabecalho
// volte para a pagina inicial, colocamos a logo dentro de 
// link do react router dom lembrando de colocar o to para indicar
// para onde ele vai redirecionar


function Header(){
    return(
    <div className='App' >
     <HeaderContainer>
      <Link to="/">
        <Logo/>
      </Link>
      
         <OpcoesHeader/>
         <IconesHeader/>

      </HeaderContainer>
    </div>
    )
}


export default Header