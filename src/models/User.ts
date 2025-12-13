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
    select: false, // Güvenlik: Kullanıcıyı çekerken şifresi gelmesin
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = models.User || model("User", UserSchema);
