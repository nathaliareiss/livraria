import mongoose from "mongoose";

const FavoritoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    livroId: {
      type: String,
      required: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

FavoritoSchema.index({ userId: 1, livroId: 1 }, { unique: true });

export default mongoose.model("Favorito", FavoritoSchema);
