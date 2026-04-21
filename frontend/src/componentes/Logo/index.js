import logo from '../imagens/logo.png'
import styled from 'styled-components'


const LogoContainer = styled.div`
    display: flex;
    font-size:30px;
`
const LogoImage = styled.img`
    margin-right: 5px;
`

function Logo(){
    return(
        <LogoContainer>
             <LogoImage
             src={logo} 
             alt='logo'
             />
              <p><strong>Nathalia</strong>Books</p>
       </LogoContainer>

    )
}

export default Logo
