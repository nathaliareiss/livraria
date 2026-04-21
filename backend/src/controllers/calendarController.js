import { google } from "googleapis";
import { getAuthClient } from "../config/googleOAuth.js";

export async function criarEvento(req, res) {
  try {
    const { summary, description, start, end } = req.body;

    if (!summary || !start || !end) {
      return res.status(400).json({ erro: "Dados obrigatorios faltando" });
    }

    const auth = await getAuthClient(req.userId);

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    const isAllDay = start.length === 10 && end.length === 10;

    const event = {
      summary,
      description,
      start: isAllDay ? { date: start } : { dateTime: start },
      end: isAllDay ? { date: end } : { dateTime: end },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function listarEventos(req, res) {
  try {
    const auth = await getAuthClient(req.userId);

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    const response = await calendar.events.list({
      calendarId: "primary",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(
      response.data.items.map((e) => ({
        id: e.id,
        summary: e.summary,
        start: e.start.date || e.start.dateTime,
        end: e.end.date || e.end.dateTime,
      }))
    );
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function deletarEvento(req, res) {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ erro: "ID do evento obrigatorio" });
    }

    const auth = await getAuthClient(req.userId);
    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    res.json({ ok: true, mensagem: "Evento deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
