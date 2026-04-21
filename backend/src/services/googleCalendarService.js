import { google } from "googleapis";
import { getAuthClient } from "../config/googleOAuth.js"

export async function criarEventoLeituraGoogle({
    userId,
    titulo,
    inicio,
}) {
    const auth = await getAuthClient(userId);
    const calendar = google.calendar({ version: "v3", auth });

    const fimPrevisto = new Date(inicio);
    fimPrevisto.setHours(fimPrevisto.getHours() + 1); 

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `📖 Leitura: ${titulo}`,
      description: descricao || "Sessão de leitura iniciada",
      start: { dateTime: inicio.toISOString() },
      end: { dateTime: fimPrevisto.toISOString() },
    },
  });



return response.data;
}