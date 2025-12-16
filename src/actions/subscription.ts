"use server";
import { connectDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addSubscription(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const name = formData.get("name") as string;
  const amount = Number(formData.get("amount"));
  const billingDay = Number(formData.get("billingDay"));

  await connectDB();

  // 1. Veritabanına kaydet
  await Subscription.create({
    userEmail: session.user.email,
    name,
    amount,
    billingDay,
  });

  // 2. Client tarafında bildirimi tetiklemek için path'i yenile
  revalidatePath("/");
}
