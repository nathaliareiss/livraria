import { createOAuthClient, SCOPES } from "../config/googleOAuth.js";
import GoogleAccount from "../models/googleAccount.js";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

export function getGoogleAuthUrl(req, res) {
  const userId = req.userId;
  const client = createOAuthClient();

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: false,
    scope: SCOPES,
    state: userId,
  });

  res.json({ url });
}

export function connectGoogle(req, res) {
  const userId = req.userId;
  const client = createOAuthClient();

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: false,
    scope: SCOPES,
    state: userId,
  });

  res.redirect(url);
}

export async function googleCallback(req, res) {
  const { code, state: userId } = req.query;

  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);

  await GoogleAccount.findOneAndUpdate(
    { userId },
    {
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    { upsert: true, new: true }
  );

  res.redirect(frontendUrl);
}

export async function disconnectGoogle(req, res) {
  try {
    const userId = req.userId;
    const conta = await GoogleAccount.findOne({ userId });

    if (!conta) {
      return res.status(400).json({ erro: "Conta Google nao conectada" });
    }

    const client = createOAuthClient();
    client.setCredentials({
      access_token: conta.accessToken,
    });

    try {
      await client.revokeToken(conta.accessToken);
    } catch (err) {
      console.warn("Nao foi possivel revogar no Google, continuando...");
    }

    await GoogleAccount.deleteOne({ userId });

    res.json({ ok: true, mensagem: "Google desconectado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
