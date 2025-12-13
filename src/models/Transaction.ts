import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  description: {
    type: String,
    required: [true, "Açıklama gereklidir"],
  },
  amount: {
    type: Number,
    required: [true, "Tutar gereklidir"],
  },
  type: {
    type: String,
    enum: ["INCOME", "EXPENSE"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // YENİ ALAN: Bu harcama kime ait?
  userEmail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
