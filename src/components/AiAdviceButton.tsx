"use client";
import { useState } from "react";
import { getFinancialAdvice } from "@/actions/ai-advice";

interface Props {
  income: number;
  expense: number;
}

export default function AiAdviceButton({ income, expense }: Props) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAi = async () => {
    setLoading(true);
    setAdvice("");
    // Artık sadece 2 veri gönderiyoruz
    const result = await getFinancialAdvice(income, expense);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-900/10 rounded-xl border border-violet-100 dark:border-violet-800">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-violet-700 dark:text-violet-300">
          ✨ Tosbaa Tavsiyesi
        </h3>
        <button
          onClick={handleAskAi}
          disabled={loading}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-full transition-all disabled:opacity-50"
        >
          {loading ? "Düşünüyor..." : "Sor"}
        </button>
      </div>
      {advice && (
        <div className="mt-3 text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-black/20 p-3 rounded-lg animate-pulse-once">
          {advice}
        </div>
      )}
    </div>
  );
}
