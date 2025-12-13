import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Yeni dosyadan alıyoruz

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
