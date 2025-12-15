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

    // 2. Harcama ise Tosbaa'nın canını düşür (Min 0)
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

// --- TOSBAA BESLEME (Para Düşmeli) ---
export async function feedTosbaaAction() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    // 1. Bakiyeden 50 TL düşmek için kayıt oluştur
    await Transaction.create({
      description: "Tosbaa Besleme (Pizza 🍕)",
      amount: 50,
      category: "Yiyecek",
      type: "EXPENSE",
      userEmail: session.user.email,
      date: new Date(),
    });

    // 2. Canı %20 artır (Max 100)
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

// --- REKLAM İZLEYEREK BESLEME (Para Düşmez) ---
export async function rewardFeedAction() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    // Sadece can artışı (Bedava besleme)
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
// Fişten okunan veriyi otomatik kaydetme
export async function addReceiptTransactionAction(
  amount: number,
  description: string
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    // 1. Harcamayı kaydet
    await Transaction.create({
      description: `Fiş: ${description}`,
      amount: amount,
      category: "Mutfak", // Varsayılan kategori
      type: "EXPENSE",
      userEmail: session.user.email,
      date: new Date(),
    });

    // 2. Tosbaa'nın canını düşür
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $inc: { tosbaaHealth: -10 } }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Fiş kayıt hatası:", error);
    return { success: false };
  }
}
// src/actions/transaction.ts dosyasına ekleyin

export async function resetMonthlyExpenses() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return;

  try {
    await connectDB();

    const now = new Date();
    // Mevcut ayın başlangıcını bul (Örn: 2024-05-01 00:00:00)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 🧹 Sadece bu kullanıcıya ait, tipi "EXPENSE" olan ve tarihi bu aydan eski olanları sil
    await Transaction.deleteMany({
      userEmail: session.user.email,
      type: "EXPENSE",
      date: { $lt: startOfMonth },
    });

    console.log(`${session.user.name} için eski ayın harcamaları temizlendi.`);
    revalidatePath("/");
  } catch (error) {
    console.error("Ay sıfırlama hatası:", error);
  }
}
// Basit bir günlük kontrol mantığı
const checkDailyLimit = (data: any[], newAmount: number) => {
  const today = new Date().toDateString();
  const todayTotal = data
    .filter(
      (t) => t.type === "EXPENSE" && new Date(t.date).toDateString() === today
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  return todayTotal + newAmount > 500;
};
