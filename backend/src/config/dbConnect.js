import mongoose from "mongoose";
import dns from "dns";

const mongoUri = process.env.STRING_CONEXAO_DB || process.env.MONGO_URI;
const mongoHost = mongoUri
  ? (() => {
      try {
        return new URL(mongoUri.replace(/^mongodb(\+srv)?:\/\//, "http://")).hostname;
      } catch {
        return "desconhecido";
      }
  })()
  : null;

let connectPromise = null;

export async function connectDb() {
  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string is not configured. Set STRING_CONEXAO_DB or MONGO_URI in backend/.env."
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    if (mongoUri.startsWith("mongodb+srv://")) {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
    }

    connectPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        console.log(`MongoDB conectado com sucesso em ${mongoHost}`);
        return connection;
      })
      .catch((error) => {
        connectPromise = null;
        console.error(`Falha ao conectar no MongoDB em ${mongoHost}`);
        console.error(error.message);
        throw error;
      });
  }

  return connectPromise;
}

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Erro de conexao", error.message);
});

db.on("disconnected", () => {
  console.warn("MongoDB desconectado");
});

export default db;
