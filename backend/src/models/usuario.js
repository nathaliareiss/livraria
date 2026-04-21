import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  dataNascimento: {
      type: Date,
      required: true, // tornar obrigatorio
    },
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
