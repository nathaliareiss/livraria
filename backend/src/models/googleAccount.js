import mongoose from "mongoose";

const GoogleAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    accessToken: String,
    refreshToken: {
      type: String,
      
    },
  },
  { timestamps: true }
);

export default mongoose.model("GoogleAccount", GoogleAccountSchema);
