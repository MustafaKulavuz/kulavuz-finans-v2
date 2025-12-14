"use client";
import { useState, useEffect } from "react";

export default function TosbaaPet({ balance }: { balance: number }) {
  // Şimdilik canı 100 olarak başlatıyoruz
  const [health, setHealth] = useState(100);
  const [mood, setMood] = useState("normal");

  useEffect(() => {
    // Bakiyeye göre Tosbaa'nın modu değişir
    if (balance >= 5000) setMood("rich");
    else if (balance > 0) setMood("happy");
    else setMood("sad");
  }, [balance]);

  const getEmoji = () => {
    if (mood === "rich") return "😎";
    if (mood === "happy") return "🐢";
    return "🤒";
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-sm rounded-[2.5rem] bg-indigo-900 p-6 text-center text-white shadow-2xl">
      {/* Can Barı */}
      <div className="mb-4 px-2">
        <div className="flex justify-between text-[10px] font-bold mb-1 text-indigo-300">
          <span>ENERJİ</span>
          <span>%{health}</span>
        </div>
        <div className="w-full bg-indigo-950 h-3 rounded-full overflow-hidden border border-indigo-800">
          <div
            className={`h-full transition-all duration-500 ${
              health > 20 ? "bg-green-500" : "bg-red-500 animate-pulse"
            }`}
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>

      <div className="text-8xl transition-transform hover:scale-110">
        {getEmoji()}
      </div>
      <div className="mt-4 text-lg font-bold">
        {mood === "sad" ? "Battık reis, karnım aç..." : "Durumlar iyi, iyiyiz!"}
      </div>
    </div>
  );
}
