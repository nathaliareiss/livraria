import styled from 'styled-components'

const LivrosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 40px 20px;
`

const LivroCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  text-align: center;
  color: #fff;
  position: relative;
  
  img {
    width: 150px;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  h3 {
    font-size: 18px;
    margin: 10px 0;
    color: #fff;
  }
  
  p {
    font-size: 14px;
    color: #ddd;
    margin-bottom: 15px;
  }
`

const BotoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
`

const Botao = styled.button`
  background-color: #cd76cc;
  color: #111011;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background-color: #d14ccf;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`



function UltimosLancamentos({ livros, onAdicionarFavorito, onComecarLer, onQueroLer, loading }) {
  if (!livros || livros.length === 0) {
    return null
  }

  return (
    <LivrosContainer>
      {livros.map(livro => (
        <LivroCard key={livro.googleId}>
          {livro.thumbnail && (
            <img src={livro.thumbnail} alt={livro.titulo} />
          )}
          <h3>{livro.titulo}</h3>
          <p>{livro.autores?.join(', ') || 'Autor desconhecido'}</p>
          
          <BotoesContainer>
            <Botao 
              onClick={() => onAdicionarFavorito(livro)}
              disabled={loading[`fav_${livro.googleId}`]}
            >
              {loading[`fav_${livro.googleId}`] ? 'Adicionando...' : '⭐ Favoritar'}
            </Botao>
            
            <Botao 
              onClick={() => onComecarLer(livro)}
              disabled={loading[`ler_${livro.googleId}`]}
            >
              {loading[`ler_${livro.googleId}`] ? 'Iniciando...' : '📖 Começar a ler'}
            </Botao>
            
            <Botao 
              onClick={() => onQueroLer(livro)}
              disabled={loading[`queroler_${livro.googleId}`]}
            >
              {loading[`queroler_${livro.googleId}`] ? 'Adicionando...' : '📚 Quero ler'}
            </Botao>
          </BotoesContainer>
        </LivroCard>
      ))}
    </LivrosContainer>
  )
}

export default UltimosLancamentos
