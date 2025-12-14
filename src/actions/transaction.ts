"use server";

import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// --- İŞLEM EKLEME ---
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

    // 2. Eğer bu bir harcamaysa Tosbaa'nın canını düşür (En az 0 olacak şekilde)
    if (type === "EXPENSE") {
      await User.findOneAndUpdate({ email: session.user.email }, [
        {
          $set: {
            tosbaaHealth: {
              $max: [0, { $subtract: ["$tosbaaHealth", 10] }],
            },
          },
        },
      ]);
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Ekleme hatası:", error);
  }
}

// --- TOSBAA BESLEME AKSİYONU (Para Düşmeli Versiyon) ---
export async function feedTosbaaAction() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    // 1. Adım: Bakiyeden 50 TL düşmek için harcama kaydı oluştur
    await Transaction.create({
      description: "Tosbaa Besleme (Pizza 🍕)",
      amount: 50,
      category: "Yiyecek",
      type: "EXPENSE",
      userEmail: session.user.email,
      date: new Date(),
    });

    // 2. Adım: Kullanıcının canını %20 artır, ama 100'ü geçmesin
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

// --- İŞLEM SİLME ---
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

// --- ID İLE İŞLEM GETİR ---
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

// --- İŞLEM GÜNCELLE ---
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
// Sadece reklam izleyenler için bedava besleme
export async function rewardFeedAction() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    // Para düşürme yok! Sadece can artışı var
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
    console.error("Ödüllü besleme hatası:", error);
  }
}
