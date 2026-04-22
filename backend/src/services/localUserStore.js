import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "..", "data");
const storePath = path.join(dataDir, "local-users.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, "[]", "utf8");
  }
}

async function readUsers() {
  await ensureStore();

  const content = await fs.readFile(storePath, "utf8");

  if (!content.trim()) {
    return [];
  }

  try {
    const users = JSON.parse(content);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  const normalizedEmail = String(email).toLowerCase();

  return users.find((user) => String(user.email).toLowerCase() === normalizedEmail) || null;
}

export async function createUser({ nome, dataNascimento, email, senha }) {
  const users = await readUsers();
  const normalizedEmail = String(email).toLowerCase();

  if (users.some((user) => String(user.email).toLowerCase() === normalizedEmail)) {
    throw new Error("LOCAL_USER_ALREADY_EXISTS");
  }

  const now = new Date().toISOString();
  const user = {
    _id: crypto.randomUUID(),
    nome,
    dataNascimento: dataNascimento ? new Date(dataNascimento).toISOString() : null,
    email,
    senha,
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  await writeUsers(users);

  return user;
}
