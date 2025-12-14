import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "İsim zorunludur"],
  },
  email: {
    type: String,
    required: [true, "Email zorunludur"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Geçersiz email adresi",
    ],
  },
  password: {
    type: String,
    required: [true, "Şifre zorunludur"],
    select: false,
  },
  tosbaaHealth: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  // 👇 BAŞARI SİSTEMİ ALANI EKLENDİ 👇
  achievements: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: String,
      icon: String, // Emoji veya ikon ismi
      unlockedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = models.User || model("User", UserSchema);
