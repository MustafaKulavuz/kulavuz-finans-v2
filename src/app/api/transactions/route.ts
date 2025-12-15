import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🔒 Güvenlik Kontrolü: Giriş yapmamış kullanıcıya veri gönderme
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 401 });
  }

  try {
    await connectDB();
    // 🔍 Sadece giriş yapan kullanıcıya ait verileri çek
    const data = await Transaction.find({ userEmail: session.user.email }).sort(
      { date: -1 }
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: "Veriler çekilemedi" }, { status: 500 });
  }
}
