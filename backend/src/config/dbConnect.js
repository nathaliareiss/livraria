import mongoose from "mongoose";

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

if (!mongoUri) {
  console.warn(
    "MongoDB connection string is not configured. Set STRING_CONEXAO_DB or MONGO_URI in backend/.env."
  );
} else {
  mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log(`MongoDB conectado com sucesso em ${mongoHost}`);
    })
    .catch((error) => {
      console.error(`Falha ao conectar no MongoDB em ${mongoHost}`);
      console.error(error.message);
    });
}

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Erro de conexao", error);
});

db.on("disconnected", () => {
  console.warn("MongoDB desconectado");
});

export default db;
