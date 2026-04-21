import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../servicos/api";
import DesconectarGoogle from "../componentes/logoutGoogle";
import ConectarGoogle from "../componentes/botaoGoogle";



const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg,#002F52 35%,#326589 165%);
  padding: 40px 20px;
`;

const Titulo = styled.h2`
  color: #FFF;
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto 30px;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
`;

const Button = styled.button`
  background-color: #cd76cc;
  color: #111011;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #d14ccf;
  }
`;

const EventosGrid = styled.div`
  display: grid;
  gap: 16px;
  max-width: 700px;
  margin: 0 auto;
`;

const EventoCard = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 8px;
  color: #fff;
`;

const GoogleButton = styled(Button)``;


export default function Calendario() {
  const [erro, setErro] = useState("");
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [eventosGoogle, setEventosGoogle] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [googleConectado, setGoogleConectado] = useState(false);



  async function carregar() {
    try {
      setErro("");
      const [eventsRes, leiturasRes] = await Promise.all([
        api.get("/calendar/events"),
        api.get("/leitura"),
      ]);
      
      setEventosGoogle(eventsRes.data);
      setLeituras(leiturasRes.data);
      setGoogleConectado(true); 
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.mensagem || "";

      if (msg.includes("Conta Google não conectada") || msg.includes("não conectada")) {
        setGoogleConectado(false);
        setErro("Conecte sua conta Google para ver e criar eventos no calendário.");
      } else if (err.response?.status === 401) {
        setErro("Você precisa estar logado.");
      } else {
        setErro("Erro ao carregar. Tente novamente.");
      }
      
      setEventosGoogle([]);
      setLeituras([]);
    }
  }
  
  useEffect(() => {
  carregar();
  }, []);



  // 🔹 Criar novo evento
  async function criarEvento(e) {
    e.preventDefault();
    setErro("");

    try {
      await api.post("/calendar/event", {
        summary: titulo,
        start: inicio,
        end: fim,
      });
      // limpa formulário
      setTitulo("");
      setInicio("");
      setFim("");

      // recarrega eventos
      carregar();
    } catch (err) {
      setErro("Erro ao criar evento");
    }
  }





  //pra ver na mesma pagina tudo que foi agendado pelo calendar,e as leituras
  //precisamos criar uma const para combinar os eventos e chamar la em baixo
  const eventosCombinados = [
    ...eventosGoogle.map(e => ({
      id: e.id,
      tipo: "calendar",
      titulo: e.summary,
      inicio: e.start?.dateTime || e.start,
      fim: e.end?.dateTime || e.end,
    })),
    ...leituras.map(l => ({
      id: l._id,
      tipo: "leitura",
      titulo: l.livroId?.titulo
        ? `Leitura: ${l.livroId.titulo}`
        : "Leitura iniciada",
      inicio: l.dataInicio,
      fim: l.dataFim,
      tempoTotal: l.tempoTotal,
    })),
  ];

  // ---------------- JSX (O QUE APARECE NA TELA) ----------------
  return (
    <AppContainer>
      <Titulo>📅 Meu Calendário de Leitura</Titulo>

      <Actions> 
  {!googleConectado ? (// quando NÃO está conectado → mostra só o botão de conectar
    <GoogleButton as={ConectarGoogle} />) :
   ( // quando ESTÁ conectado → mostra texto + botão de desconectar
    <>
      <GoogleButton as={(props) => (<DesconectarGoogle {...props} onDesconectado={() => {
              setGoogleConectado(false);
              setEventosGoogle([])
            }} /> 
            )}/>
    </>
  )}
</Actions>

      {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

      <Card>
        <form onSubmit={criarEvento}>
          <Input
            placeholder="Título do evento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Input
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            required
          />
          <Input
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            required
          />
          <Button type="submit">Criar evento</Button>
        </form>
      </Card>

      <EventosGrid>
      {eventosCombinados.map(evento => (
    <EventoCard key={evento.id}>
      <strong>
        {evento.titulo}{" "}
        {evento.tipo === "leitura" && <span style={{ fontSize: 12 }}>• Evento de leitura</span>}
      </strong>
      <p>{new Date(evento.inicio).toLocaleString()}</p>
      {evento.fim && <p>Até: {new Date(evento.fim).toLocaleString()}</p>}
      {evento.tipo === "leitura" && evento.tempoTotal && (
        <p>Duração total: {evento.tempoTotal} min</p>
      )}
          </EventoCard>
        ))}
      </EventosGrid>
    </AppContainer>
  );
}