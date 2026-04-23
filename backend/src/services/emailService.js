import nodemailer from "nodemailer";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = 587;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";

  if (!host || !user || !pass) {
    throw new Error("Servidor de email nao configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS.");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

export async function sendPasswordResetCodeEmail({ to, code }) {
  const from = (process.env.SMTP_FROM || process.env.SMTP_USER || "").trim();

  if (!from) {
    throw new Error("Defina SMTP_FROM ou SMTP_USER para enviar emails.");
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from,
    to,
    subject: "Codigo de recuperacao da senha",
    text: [
      "Recebemos uma solicitacao para redefinir sua senha.",
      "",
      `Seu codigo de recuperacao e: ${code}`,
      "",
      "Se voce nao solicitou isso, pode ignorar este email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 12px;">Recuperacao de senha</h2>
        <p style="margin: 0 0 12px;">Recebemos uma solicitacao para redefinir sua senha.</p>
        <p style="margin: 0 0 12px;">Seu codigo de recuperacao:</p>
        <div style="display:inline-block;padding:12px 16px;border:1px dashed #10b981;border-radius:12px;font-size:20px;font-weight:700;letter-spacing:0.18em;">
          ${code}
        </div>
        <p style="margin: 16px 0 0;">Se voce nao solicitou isso, pode ignorar este email.</p>
      </div>
    `,
  });
}
