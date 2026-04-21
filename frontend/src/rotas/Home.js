import styled from 'styled-components'
import { useState } from 'react'
import api from '../servicos/api'
import Pesquisa from '../componentes/Pesquisa'
import UltimosLancamentos from '../componentes/ultimoslancamentos'
import { adicionarLivro, alternarFavorito, alternarQueroLer, iniciarLeitura } from '../servicos/livros'


const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg,#896587 35%,#326589 100%);
`

function Home() {
  const [livros, setLivros] = useState([])
  const [erro, setErro] = useState('')
  const [loading, setLoading]= useState({})

  async function buscarLivros(termo) {
    try {
      setErro('')
      const res = await api.get(`/books/search?q=${termo}`)
      setLivros(res.data)
    } catch (err) {
      setErro('Erro ao buscar livros')
    }
  }

async function handleAdicionarFavorito(livroGoogle){
  try{
    setLoading({...loading,[`fav_${livroGoogle.googleId}`]:true})

    //aqui primeiro vamos adicionar na estante pra depois add aos fav
    const livroAdicionado = await adicionarLivro(livroGoogle)
    //aqui marca como favorito
    await alternarFavorito(livroAdicionado._id)

    alert('Livro adicionado aos favoritos')
  }catch(err){
    alert(err.response?.data?.mensagem || 'Erro ao adicionar aos favoritos')
  }finally{
    setLoading({...loading,[`fav_${livroGoogle.googleId}`]:false})
  }
}
async function handleComecarLer(livroGoogle) {
  try {
    setLoading({ ...loading, [`ler_${livroGoogle.googleId}`]: true })
    
    // Primeiro adiciona à estante
    const livroAdicionado = await adicionarLivro(livroGoogle)
    
    // Depois inicia a leitura
    await iniciarLeitura(livroAdicionado._id)
    
    alert('Leitura iniciada! Evento criado no Google Calendar.')
  } catch (err) {
    alert(err.response?.data?.mensagem || 'Erro ao iniciar leitura')
  } finally {
    setLoading({ ...loading, [`ler_${livroGoogle.googleId}`]: false })
  }
}
async function handleQueroLer(livroGoogle) {
  try {
    setLoading({ ...loading, [`queroler_${livroGoogle.googleId}`]: true })
    
    // Primeiro adiciona à estante
    const livroAdicionado = await adicionarLivro(livroGoogle)
    
    // Depois marca como "quero ler"
    await alternarQueroLer(livroAdicionado._id)
    
    alert('Livro adicionado à lista "Quero Ler"!')
  } catch (err) {
    alert(err.response?.data?.mensagem || 'Erro ao adicionar')
  } finally {
    setLoading({ ...loading, [`queroler_${livroGoogle.googleId}`]: false })
  }
}






  return (
    <AppContainer>
      <Pesquisa onBuscar={buscarLivros} />
      {erro && <p style={{ color: '#fff' }}>{erro}</p>}
      <UltimosLancamentos livros={livros}
      onAdicionarFavorito={handleAdicionarFavorito}
      onComecarLer={handleComecarLer}
      onQueroLer={handleQueroLer}
      loading={loading}
       />
    </AppContainer>
  )
}

export default Home
