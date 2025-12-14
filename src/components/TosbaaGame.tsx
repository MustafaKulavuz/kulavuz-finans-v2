"use client";
import { useState } from "react";
import TosbaaPet from "./TosbaaPet";
import { Utensils } from "lucide-react";

export default function TosbaaGame({
  initialBalance,
}: {
  initialBalance: number;
}) {
  const [health, setHealth] = useState(100);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);

  const feedTosbaa = () => {
    if (currentBalance >= 50) {
      setHealth((prev) => Math.min(100, prev + 20)); // Canı %20 artır
      setCurrentBalance((prev) => prev - 50); // Bakiyeyi düşür
      alert("Ham ham ham! 🍕 Tosbaa çok mutlu.");
    } else {
      alert("Cüzdan boş, Tosbaa aç kaldı! 🐢❌");
    }
  };

  return (
    <section className="rounded-[2.5rem] bg-indigo-950 p-6 shadow-2xl border border-indigo-900 overflow-hidden relative">
      {/* Buradaki health prop'u sayesinde bar hareket edecek */}
      <TosbaaPet balance={currentBalance} health={health} />

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={feedTosbaa}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 p-4 font-black text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Utensils size={20} />
          <span>TOSBAA'YI BESLE (50 ₺)</span>
        </button>
        <p className="text-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
          Enerji: %{health} - Besleyince canlanır!
        </p>
      </div>
    </section>
  );
}
