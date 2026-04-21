import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../servicos/api";
import DesconectarGoogle from "../componentes/logoutGoogle";
import ConectarGoogle from "../componentes/botaoGoogle";
import { PageShell, PageSection, SurfaceCard, PrimaryButton } from "../componentes/ui";
import { colors } from "../styles/theme";

const Wrapper = styled(PageSection)`
  padding: 40px 0 56px;
`;

const Title = styled.h1`
  margin: 0 0 20px;
  text-align: center;
  font-size: clamp(30px, 4vw, 44px);
  letter-spacing: -0.04em;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Card = styled(SurfaceCard)`
  padding: 24px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceAlt};
  color: ${colors.text};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px ${colors.primarySoft};
  }
`;

const EventosGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const EventoCard = styled(SurfaceCard)`
  padding: 18px;
`;

const EventTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
`;

const Meta = styled.p`
  margin: 0 0 6px;
  color: ${colors.muted};
`;

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

      if (msg.includes("Conta Google nao conectada") || msg.includes("nao conectada")) {
        setGoogleConectado(false);
        setErro("Conecte sua conta Google para criar e visualizar eventos.");
      } else if (err.response?.status === 401) {
        setErro("Voce precisa estar logado.");
      } else {
        setErro("Erro ao carregar o calendario.");
      }

      setEventosGoogle([]);
      setLeituras([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criarEvento(e) {
    e.preventDefault();
    setErro("");

    try {
      await api.post("/calendar/event", {
        summary: titulo,
        start: inicio,
        end: fim,
      });
      setTitulo("");
      setInicio("");
      setFim("");
      carregar();
    } catch (err) {
      setErro("Erro ao criar evento.");
    }
  }

  const eventosCombinados = [
    ...eventosGoogle.map((e) => ({
      id: e.id,
      tipo: "calendar",
      titulo: e.summary,
      inicio: e.start?.dateTime || e.start,
      fim: e.end?.dateTime || e.end,
    })),
    ...leituras.map((l) => ({
      id: l._id,
      tipo: "leitura",
      titulo: l.livroId?.titulo ? `Leitura: ${l.livroId.titulo}` : "Leitura iniciada",
      inicio: l.dataInicio,
      fim: l.dataFim,
      tempoTotal: l.tempoTotal,
    })),
  ];

  return (
    <PageShell>
      <Wrapper>
        <Title>Calendário de leitura</Title>

        <Actions>
          {!googleConectado ? (
            <ConectarGoogle />
          ) : (
            <DesconectarGoogle
              onDesconectado={() => {
                setGoogleConectado(false);
                setEventosGoogle([]);
              }}
            />
          )}
        </Actions>

        {erro && <p style={{ color: colors.danger, textAlign: "center" }}>{erro}</p>}

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
            <PrimaryButton type="submit">Criar evento</PrimaryButton>
          </form>
        </Card>

        <EventosGrid>
          {eventosCombinados.map((evento) => (
            <EventoCard key={evento.id}>
              <EventTitle>{evento.titulo}</EventTitle>
              <Meta>{new Date(evento.inicio).toLocaleString()}</Meta>
              {evento.fim && <Meta>Até: {new Date(evento.fim).toLocaleString()}</Meta>}
              {evento.tipo === "leitura" && evento.tempoTotal && (
                <Meta>Duração total: {evento.tempoTotal} min</Meta>
              )}
            </EventoCard>
          ))}
        </EventosGrid>
      </Wrapper>
    </PageShell>
  );
}
