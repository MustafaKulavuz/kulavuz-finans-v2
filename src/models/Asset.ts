import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  type: { type: String, enum: ["USD", "EUR", "GOLD", "TRY"], required: true },
  amount: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Eğer model zaten tanımlanmışsa onu kullan, yoksa yeni tanımla
export const Asset =
  mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
