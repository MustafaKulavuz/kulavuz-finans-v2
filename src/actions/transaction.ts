"use server";

import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// --- MEVCUT EKLEME VE SİLME FONKSİYONLARI BURADA KALSIN (Aynen Koru) ---
// (Eğer silindiğini düşünüyorsan önceki kodlarını buraya tekrar yapıştırabilirsin)
// Ben senin için tam halini veriyorum garanti olsun:

export async function addTransaction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;

  if (!description || !amount || !category) return;

  const type =
    category === "Maaş" || category === "Ek Gelir" ? "INCOME" : "EXPENSE";

  try {
    await connectDB();
    await Transaction.create({
      description,
      amount,
      category,
      type,
      userEmail: session.user.email,
      date: new Date(),
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Ekleme hatası:", error);
  }
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();
    await Transaction.findOneAndDelete({
      _id: id,
      userEmail: session.user.email,
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Silme hatası:", error);
  }
}

// --- YENİ EKLENENLER: DÜZENLEME İÇİN ---

// 1. Tek bir harcamanın detayını getir (Düzenleme sayfasına veriyi doldurmak için)
export async function getTransactionById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  await connectDB();
  const transaction = await Transaction.findOne({
    _id: id,
    userEmail: session.user.email,
  });

  // MongoDB verisini düz objeye çevirip döndür
  if (!transaction) return null;
  return {
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    id: transaction._id.toString(),
  };
}

// 2. Harcamayı Güncelle
export async function updateTransaction(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  const description = formData.get("description");
  const amount = formData.get("amount");
  const category = formData.get("category");

  const type =
    category === "Maaş" || category === "Ek Gelir" ? "INCOME" : "EXPENSE";

  try {
    await connectDB();
    await Transaction.findOneAndUpdate(
      { _id: id, userEmail: session.user.email }, // Sadece bu kullanıcıya aitse güncelle
      { description, amount, category, type }
    );
  } catch (error) {
    console.error("Güncelleme Hatası:", error);
  }

  revalidatePath("/");
  redirect("/"); // İşlem bitince ana sayfaya dön
}
