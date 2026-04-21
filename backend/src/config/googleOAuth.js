import { google } from "googleapis";
import GoogleAccount from "../models/googleAccount.js";

export const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

/**
  CONEXÃO DA CONTA GOOGLE

 */
export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export async function getAuthClient(userId) {
  const conta = await GoogleAccount.findOne({ userId });

  if (!conta  || !conta.refreshToken) {
    throw new Error("Conta Google não conectada");
  }

  const oAuth2Client = createOAuthClient();

  oAuth2Client.setCredentials({
    refresh_token: conta.refreshToken,
  });

  return oAuth2Client;
}
