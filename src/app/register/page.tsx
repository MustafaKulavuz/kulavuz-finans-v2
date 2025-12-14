"use client"; // İstemci tarafında çalışması için şart

import { registerUser } from "@/actions/auth";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AiAdviceButton from "@/components/AiAdviceButton";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      // Server Action'ı çağır
      await registerUser(formData);

      // Başarılıysa login sayfasına yönlendir
      router.push("/login");
    } catch (err: any) {
      // Hata varsa ekrana yazdır
      console.error(err);
      setError("Kayıt işlemi başarısız. Lütfen tekrar deneyin.");
    } finally {
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
          <p className="mt-3 text-sm font-medium text-slate-500">
            Hemen ücretsiz hesap oluştur.
          </p>
        </div>

        {/* HATA MESAJI KUTUSU */}
        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-center text-sm font-bold text-rose-600 border border-rose-100">
            {error}
          </div>
        )}

        {/* Form yapısı onSubmit ile bağlandı */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Ad Soyad
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-2xl border-none bg-slate-100 p-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Örn: Mustafa Kılavuz"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Adresi
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
            className="w-full rounded-2xl bg-indigo-600 py-4 font-black text-white shadow-lg shadow-indigo-200 transition-transform hover:scale-[1.02] hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "KAYIT YAPILIYOR..." : "KAYIT OL"}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500">
          Zaten hesabın var mı?{" "}
          <Link
            href="/login"
            className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
