import mongoose from "mongoose"

const mongoUri = process.env.STRING_CONEXAO_DB || process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("Missing MongoDB connection string. Set STRING_CONEXAO_DB or MONGO_URI in backend/.env");
}

mongoose.connect(mongoUri);

let db = mongoose.connection;

export default db;
