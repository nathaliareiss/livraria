import mongoose from "mongoose";

const EventoLeituraSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    livroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livro",
      required: true,
    },
//vamos registrar para que seja capaz de calcular e inserir no calendario o evento
    dataInicio: {
    type: Date,
    required: true,
  },

   dataFim: {
    type: Date,
  },

   tempoTotal: {
    type: Number, // em minutos
  },

  
  googleEventId: {
    type: String
  }
  
}, { timestamps: true }
);

export default mongoose.model("EventoLeitura", EventoLeituraSchema);
