import { useEffect, useState } from "react";
import styled from 'styled-components';
import api from '../servicos/api';
import { iniciarLeitura, finalizarLeitura } from '../servicos/livros';

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg,#002F52 35%,#326589 165%);
  padding: 40px 20px;
`

const Titulo = styled.h2`
  color: #FFF;
  font-size: 36px;
  text-align: center;
  width: 100%;
  margin-bottom: 30px;
`

const Secao = styled.section`
  margin-bottom: 50px;
`

const SecaoTitulo = styled.h3`
  color: #FFF;
  font-size: 24px;
  margin-bottom: 20px;
  padding-left: 20px;
`

const LivrosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`

const LivroCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  text-align: center;
  color: #fff;
  
  img {
    width: 150px;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  h4 {
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

const Botao = styled.button`
  background-color: #cd76cc;
  color: #111011;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin: 5px;
  
  &:hover {
    background-color: #d14ccf;
  }
`

function EstanteLivros() {
  const [estante, setEstante] = useState({
    favoritos: [],
    lendo: [],
    lidos: [],
    queroLer: []
  });
  const [loading, setLoading] = useState(false);

  async function carregarEstante() {
    try {
      setLoading(true);
      const response = await api.get('/estante');
      setEstante(response.data);
    } catch (err) {
      alert('Erro ao carregar estante');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleIniciarLeitura(livroId) {
    try {
      await iniciarLeitura(livroId);
      alert('Leitura iniciada! Evento criado no Google Calendar.');
      carregarEstante(); // Recarrega a estante
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao iniciar leitura');
    }
  }

  async function handleFinalizarLeitura(livroId) {
    try {
      const resultado = await finalizarLeitura(livroId);
      alert(`Leitura finalizada! Tempo total: ${resultado.tempoTotal} minutos`);
      carregarEstante(); // Recarrega a estante
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao finalizar leitura');
    }
  }

  useEffect(() => {
    carregarEstante();
  }, []);

  if (loading) {
    return (
      <AppContainer>
        <Titulo>Carregando estante...</Titulo>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Titulo>Minha Estante</Titulo>

      {/* Favoritos */}
      <Secao>
        <SecaoTitulo>⭐ Favoritos</SecaoTitulo>
        <LivrosGrid>
          {estante.favoritos.length > 0 ? (
            estante.favoritos.map(livro => (
              <LivroCard key={livro._id}>
                {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                <h4>{livro.titulo}</h4>
                <p>{livro.autores?.join(', ') || 'Autor desconhecido'}</p>
                {livro.statusLeitura !== "lendo" && livro.statusLeitura !== "lido" && (
                  <Botao onClick={() => handleIniciarLeitura(livro._id)}>
                    Iniciar leitura
                  </Botao>
                )}
              </LivroCard>
            ))
          ) : (
            <p style={{ color: '#fff' }}>Nenhum favorito ainda</p>
          )}
        </LivrosGrid>
      </Secao>

      {/* Lendo */}
      <Secao>
        <SecaoTitulo>📖 Lendo</SecaoTitulo>
        <LivrosGrid>
          {estante.lendo.length > 0 ? (
            estante.lendo.map(livro => (
              <LivroCard key={livro._id}>
                {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                <h4>{livro.titulo}</h4>
                <p>{livro.autores?.join(', ') || 'Autor desconhecido'}</p>
                <Botao onClick={() => handleFinalizarLeitura(livro._id)}>
                  Finalizar leitura
                </Botao>
              </LivroCard>
            ))
          ) : (
            <p style={{ color: '#fff' }}>Nenhum livro sendo lido no momento</p>
          )}
        </LivrosGrid>
      </Secao>

      {/* Lidos */}
      <Secao>
        <SecaoTitulo>✅ Lidos</SecaoTitulo>
        <LivrosGrid>
          {estante.lidos.length > 0 ? (
            estante.lidos.map(livro => (
              <LivroCard key={livro._id}>
                {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                <h4>{livro.titulo}</h4>
                <p>{livro.autores?.join(', ') || 'Autor desconhecido'}</p>
                {livro.dataFimLeitura && (
                  <p style={{ fontSize: '12px', color: '#aaa' }}>
                    Finalizado em: {new Date(livro.dataFimLeitura).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </LivroCard>
            ))
          ) : (
            <p style={{ color: '#fff' }}>Nenhum livro lido ainda</p>
          )}
        </LivrosGrid>
      </Secao>

      {/* Quero Ler */}
      <Secao>
        <SecaoTitulo>📚 Quero Ler</SecaoTitulo>
        <LivrosGrid>
          {estante.queroLer.length > 0 ? (
            estante.queroLer.map(livro => (
              <LivroCard key={livro._id}>
                {livro.thumbnail && <img src={livro.thumbnail} alt={livro.titulo} />}
                <h4>{livro.titulo}</h4>
                <p>{livro.autores?.join(', ') || 'Autor desconhecido'}</p>
                <Botao onClick={() => handleIniciarLeitura(livro._id)}>
                  Iniciar leitura
                </Botao>
              </LivroCard>
            ))
          ) : (
            <p style={{ color: '#fff' }}>Nenhum livro na lista "Quero Ler"</p>
          )}
        </LivrosGrid>
      </Secao>
    </AppContainer>
  );
}

export default EstanteLivros;