import nodemailer from "nodemailer";

let cachedTransporter = null;
let transporterCheckPromise = null;

async function getTransporter() {
  if (cachedTransporter) {
    if (!transporterCheckPromise) {
      transporterCheckPromise = cachedTransporter.verify();
    }

    await transporterCheckPromise;
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
  const useGmailService =
    String(process.env.SMTP_SERVICE || "").toLowerCase() === "gmail" ||
    String(host || "").toLowerCase().includes("gmail.com");

  if (!host || !user || !pass) {
    throw new Error("Servidor de email nao configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS.");
  }

  cachedTransporter = useGmailService
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
      })
    : nodemailer.createTransport({
        host,
        port: 587,
        secure,
        auth: {
          user,
          pass,
        },
      });

  transporterCheckPromise = cachedTransporter.verify();
  await transporterCheckPromise;
  return cachedTransporter;
}

export async function sendPasswordResetCodeEmail({ to, code }) {
  const from = (process.env.SMTP_FROM || process.env.SMTP_USER || "").trim();

  if (!from) {
    throw new Error("Defina SMTP_FROM ou SMTP_USER para enviar emails.");
  }

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
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

  if (process.env.NODE_ENV !== "production") {
    console.log("Email de recuperacao enviado", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  }
}
