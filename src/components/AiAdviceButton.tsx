"use client";
import { useState } from "react";
import { getFinancialAdvice } from "@/actions/ai-advice";
import { Sparkles, Loader2 } from "lucide-react";

export default function AiAdviceButton({
  income,
  expense,
  assets,
  rates,
}: any) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      // assets ve rates'in dizi/obje olduğundan emin olarak gönder
      const safeAssets = Array.isArray(assets) ? assets : [];
      const safeRates = rates && typeof rates === "object" ? rates : {};

      const response = await getFinancialAdvice(
        income,
        expense,
        safeAssets,
        safeRates
      );
      setAdvice(response);
    } catch (e) {
      console.error("Buton Hatası:", e);
      setAdvice("Bağlantı kurulamadı, lütfen internetini kontrol et! 🐢");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGetAdvice}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 rounded-[2rem] flex items-center justify-center gap-3 font-black shadow-xl active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Sparkles size={24} /> TOSBAA YATIRIM TAVSİYESİ AL
          </>
        )}
      </button>

      {advice && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-900/30">
          <p className="text-slate-700 dark:text-slate-200 italic font-medium">
            "{advice}"
          </p>
        </div>
      )}
    </div>
  );
}
