"use client"; // İstemci tarafında çalışacağını belirtir

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // NextAuth ile giriş yapmayı dene
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Sayfa yenilenmesin, biz yönlendireceğiz
      });

      if (res?.error) {
        setError("Email veya şifre hatalı!");
        setLoading(false);
      } else {
        // Başarılı! Ana sayfaya yönlendir
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Bir hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-10 shadow-2xl border border-slate-100">
        <div className="text-center">
          <h1 className="flex justify-center items-center gap-2 text-3xl font-black text-slate-900 tracking-tight">
            Kılavuz Finans <Sparkles className="text-indigo-500" />
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Tekrar Hoşgeldin!
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Hesabına giriş yap ve yönetmeye başla.
          </p>
        </div>

        {/* Hata Mesajı Kutusu */}
        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-center text-sm font-bold text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border-none bg-slate-100 p-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="isim@ornek.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border-none bg-slate-100 p-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="******"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-slate-800 active:scale-95 disabled:opacity-50"
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500">
          Hesabın yok mu?{" "}
          <Link
            href="/register"
            className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
