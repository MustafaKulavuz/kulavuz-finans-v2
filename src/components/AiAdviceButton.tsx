"use client";
import { useState } from "react";
import { getFinancialAdvice } from "@/actions/ai-advice";
import { Sparkles, Loader2 } from "lucide-react";

interface AiAdviceButtonProps {
  income: number;
  expense: number;
  assets?: any[]; // Yeni eklenen prop
  rates?: any; // Yeni eklenen prop
}

export default function AiAdviceButton({
  income,
  expense,
  assets = [],
  rates = {},
}: AiAdviceButtonProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    // Artık assets ve rates verilerini AI fonksiyonuna gönderiyoruz
    const response = await getFinancialAdvice(income, expense, assets, rates);
    setAdvice(response);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGetAdvice}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black p-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <>
            <Sparkles size={24} /> TOSBAA YATIRIM TAVSİYESİ AL
          </>
        )}
      </button>

      {advice && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-900/30 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
            " {advice} "
          </p>
          <div className="mt-3 text-[10px] font-black text-indigo-500 uppercase tracking-widest text-right">
            — Bilge Tosbaa 🐢🏛️
          </div>
        </div>
      )}
    </div>
  );
}
