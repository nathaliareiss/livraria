import mongoose from "mongoose";

const LivroSchema = new mongoose.Schema(
  {
    // Dados vindos da Google Books API
    googleBookId: {
      type: String,
      required: true,
    },

    titulo: {
      type: String,
      required: true,
    },

    autores: [
      {
        type: String,
      }
    ],

    editora: {
      type: String,
    },

    descricao: {
      type: String,
    },

    thumbnail: {
      type: String, // imagem da capa
    },

    // Relacionamento com usuário
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // parte que vai marcar o inicio da leitura
    //para criar o evento no calendario
    statusLeitura: {
      type: String,
      enum: ["nao_lido", "lendo", "lido"],
      default: "nao_lido",
    },

    dataInicioLeitura: {
      type: Date,
    },

    dataFimLeitura: {
      type: Date,
    },
//pra ser possivel colocar na parte de favoritos
    favorito: {
      type: Boolean,
      default: false,
    },
    calendarEventId: {
      type: String,
    },
    queroLer: {
      type: Boolean,
      default: false,
  },
},{
    timestamps: true, // createdAt / updatedAt
}
);

export default mongoose.model("Livro", LivroSchema);
