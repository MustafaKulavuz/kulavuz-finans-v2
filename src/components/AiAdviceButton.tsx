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
      // Değişkenlerin varlığını kontrol ederek gönder
      const response = await getFinancialAdvice(
        income,
        expense,
        assets || [],
        rates || {}
      );
      setAdvice(response);
    } catch (e) {
      setAdvice("Bağlantı hatası oluştu. 🐢");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGetAdvice}
        disabled={loading}
        className="w-full bg-indigo-600 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Sparkles /> TAVSİYE AL
          </>
        )}
      </button>
      {advice && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl italic">
          "{advice}"
        </div>
      )}
    </div>
  );
}
