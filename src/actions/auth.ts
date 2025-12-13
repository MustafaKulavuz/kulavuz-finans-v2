"use server";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
// import { redirect } from "next/navigation"; // BU SATIRI KALDIRDIK

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("Lütfen tüm alanları doldurun.");
  }

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Bu email adresi zaten kullanılıyor.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Burada artık redirect yapmıyoruz, işlemi başarıyla bitiriyoruz.
  return { success: true };
}
