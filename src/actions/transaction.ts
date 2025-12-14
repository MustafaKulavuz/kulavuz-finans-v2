"use server";

import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User"; // Kullanıcı modelini ekledik
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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

    // 1. İşlemi Kaydet
    await Transaction.create({
      description,
      amount,
      category,
      type,
      userEmail: session.user.email,
      date: new Date(),
    });

    // 2. Eğer bu bir harcamaysa Tosbaa'nın canını düşür
    if (type === "EXPENSE") {
      await User.findOneAndUpdate(
        { email: session.user.email },
        {
          $inc: { tosbaaHealth: -10 }, // Canı 10 düşür
          // Canın 0'ın altına düşmesini önlemek için ek güvenlik (Opsiyonel)
        },
        { new: true }
      );
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Ekleme hatası:", error);
  }
}

// TOSBAA BESLEME AKSİYONU (Yeni Eklendi)
export async function feedTosbaaAction() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    // Kullanıcının canını %20 artır, ama 100'ü geçmesin
    // MongoDB $min ve $max operatörleri ile bunu sınırlayabiliriz
    await User.findOneAndUpdate({ email: session.user.email }, [
      {
        $set: {
          tosbaaHealth: {
            $min: [100, { $add: ["$tosbaaHealth", 20] }],
          },
        },
      },
    ]);

    revalidatePath("/");
  } catch (error) {
    console.error("Besleme Hatası:", error);
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

export async function getTransactionById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  await connectDB();
  const transaction = await Transaction.findOne({
    _id: id,
    userEmail: session.user.email,
  });

  if (!transaction) return null;
  return {
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    id: transaction._id.toString(),
  };
}

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
      { _id: id, userEmail: session.user.email },
      { description, amount, category, type }
    );
  } catch (error) {
    console.error("Güncelleme Hatası:", error);
  }

  revalidatePath("/");
  redirect("/");
}
