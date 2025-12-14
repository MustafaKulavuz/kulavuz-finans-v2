"use client";
import { useState, useTransition } from "react";
import TosbaaPet from "./TosbaaPet";
import { Utensils, Loader2, Ban } from "lucide-react"; // Ban ikonu ekledik
import { feedTosbaaAction } from "@/actions/transaction";

export default function TosbaaGame({
  initialBalance,
  initialHealth,
}: {
  initialBalance: number;
  initialHealth: number;
}) {
  const [isPending, startTransition] = useTransition();

  // Tosbaa tam toksa (canı 100 ise) beslemeyi engelle
  const isFull = initialHealth >= 100;

  const handleFeed = () => {
    if (isFull) return; // Kod tarafında da koruma

    if (initialBalance < 50) {
      alert("Cüzdan boş, Tosbaa aç kaldı! 🐢❌");
      return;
    }

    startTransition(async () => {
      await feedTosbaaAction();
    });
  };

  return (
    <section className="rounded-[2.5rem] bg-indigo-950 p-6 shadow-2xl border border-indigo-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

      <TosbaaPet balance={initialBalance} health={initialHealth} />

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleFeed}
          disabled={isPending || isFull} // Can 100 ise buton tıklanamaz olur
          className={`flex w-full items-center justify-center gap-2 rounded-2xl p-4 font-black text-white shadow-lg transition-all active:scale-95 ${
            isFull
              ? "bg-slate-600 cursor-not-allowed opacity-70" // Tokken gri renk
              : isPending
              ? "bg-orange-800 cursor-wait"
              : "bg-orange-500 hover:scale-[1.02]"
          }`}
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isFull ? (
            <Ban size={20} />
          ) : (
            <Utensils size={20} />
          )}
          <span>
            {isPending
              ? "BESLENİYOR..."
              : isFull
              ? "TOSBAA ŞU AN TOK 🐢"
              : "TOSBAA'YI BESLE (50 ₺)"}
          </span>
        </button>

        <p className="text-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
          {isFull
            ? "Tosbaa tamamen doydu, biraz harcama yapma ki acıkmasın!"
            : initialHealth <= 20
            ? "DİKKAT: Tosbaa çok acıktı! 🤒"
            : "Enerji Veritabanına Kaydediliyor 💾"}
        </p>
      </div>
    </section>
  );
}
