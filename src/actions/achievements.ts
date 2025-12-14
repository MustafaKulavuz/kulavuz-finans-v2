"use server";

import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function checkAchievements() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) return null;

    // 1. KONTROL: Başarı zaten kazanılmış mı?
    const hasTutumlu = user.achievements?.some(
      (a: any) => a.id === "tutumlu-tosbaa"
    );

    if (hasTutumlu) return null; // Zaten varsa bir şey yapma

    // 2. KONTROL: Son 3 gün içinde harcama var mı?
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentExpense = await Transaction.findOne({
      userEmail: session.user.email,
      type: "EXPENSE",
      date: { $gte: threeDaysAgo },
    });

    // 3. ADIM: Eğer son 3 günde hiç harcama (EXPENSE) yoksa başarıyı ver!
    if (!recentExpense) {
      const newAchievement = {
        id: "tutumlu-tosbaa",
        title: "Tutumlu Tosbaa",
        description:
          "3 gün boyunca hiç harcama yapmayarak Tosbaa'yı gururlandırdın!",
        icon: "📉",
        unlockedAt: new Date(),
      };

      await User.findOneAndUpdate(
        { email: session.user.email },
        { $push: { achievements: newAchievement } }
      );

      revalidatePath("/");
      return newAchievement; // Başarı kazanıldı bilgisini döndür
    }

    return null;
  } catch (error) {
    console.error("Başarı kontrol hatası:", error);
    return null;
  }
}
