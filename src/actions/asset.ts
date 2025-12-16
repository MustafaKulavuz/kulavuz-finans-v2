"use server";
import { connectDB } from "@/lib/mongodb";
import { Asset } from "@/models/Asset";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { revalidatePath } from "next/cache";

export async function addOrUpdateAsset(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const type = formData.get("type") as string; // USD, EUR, GOLD
  const amount = Number(formData.get("amount"));

  await connectDB();

  // Varsa güncelle, yoksa yeni oluştur
  await Asset.findOneAndUpdate(
    { userEmail: session.user.email, type },
    { amount, lastUpdated: new Date() },
    { upsert: true }
  );

  revalidatePath("/");
}
