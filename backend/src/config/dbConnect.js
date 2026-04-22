import mongoose from "mongoose";

const mongoUri = process.env.STRING_CONEXAO_DB || process.env.MONGO_URI;

if (!mongoUri) {
  console.warn(
    "MongoDB connection string is not configured. Set STRING_CONEXAO_DB or MONGO_URI in backend/.env."
  );
} else {
  mongoose
    .connect(mongoUri)
    .catch((error) => {
      console.error("Erro de conexao com o MongoDB", error);
    });
}

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Erro de conexao", error);
});

export default db;
