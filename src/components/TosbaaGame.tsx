"use client";
import { useState, useTransition } from "react";
import TosbaaPet from "./TosbaaPet";
import { Utensils, Loader2 } from "lucide-react";
import { feedTosbaaAction } from "@/actions/transaction"; // Aksiyonu içe aktardık

export default function TosbaaGame({
  initialBalance,
  initialHealth,
}: {
  initialBalance: number;
  initialHealth: number;
}) {
  const [isPending, startTransition] = useTransition();

  const handleFeed = () => {
    if (initialBalance < 50) {
      alert("Cüzdan boş, Tosbaa aç kaldı! 🐢❌");
      return;
    }

    // Server Action'ı tetikliyoruz
    startTransition(async () => {
      await feedTosbaaAction();
      // İşlem bitince sayfa otomatik yenilenir (revalidatePath sayesinde)
    });
  };

  return (
    <section className="rounded-[2.5rem] bg-indigo-950 p-6 shadow-2xl border border-indigo-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

      {/* Veritabanından gelen canı buraya paslıyoruz */}
      <TosbaaPet balance={initialBalance} health={initialHealth} />

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleFeed}
          disabled={isPending}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl p-4 font-black text-white shadow-lg transition-transform active:scale-95 ${
            isPending
              ? "bg-orange-800 cursor-not-allowed"
              : "bg-orange-500 hover:scale-[1.02]"
          }`}
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Utensils size={20} />
          )}
          <span>{isPending ? "BESLENİYOR..." : "TOSBAA'YI BESLE (50 ₺)"}</span>
        </button>
        <p className="text-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
          {initialHealth <= 20
            ? "DİKKAT: Tosbaa çok acıktı! 🤒"
            : "Enerji Veritabanına Kaydediliyor 💾"}
        </p>
      </div>
    </section>
  );
}
