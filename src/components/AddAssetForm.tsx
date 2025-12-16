"use client";
import { addOrUpdateAsset } from "@/actions/asset";
import { Coins, Plus } from "lucide-react";

export default function AddAssetForm() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await addOrUpdateAsset(formData);
      alert("Varlık başarıyla kaydedildi! 🐢💰");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="flex items-center gap-2 font-black text-slate-800 dark:text-white mb-6 uppercase text-sm tracking-widest">
        <Coins className="text-yellow-500" size={20} /> Varlık Miktarı Güncelle
      </h3>

      <form action={handleSubmit} className="flex flex-col gap-4">
        {/* Varlık Türü Seçimi - Tam Genişlik */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
            Varlık Türü
          </label>
          <select
            name="type"
            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold text-slate-700 dark:text-white border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none"
            required
          >
            <option value="USD">💵 USD (Dolar)</option>
            <option value="EUR">💶 EUR (Euro)</option>
            <option value="GOLD">🌕 GOLD (Gram Altın)</option>
          </select>
        </div>

        {/* Miktar Girişi - Alt Satıra Alındı */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
            Miktar
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Örn: 100.50"
            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none text-slate-700 dark:text-white border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 font-bold"
            required
          />
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black p-4 mt-2 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-100 dark:shadow-none"
        >
          <Plus size={20} /> VARLIĞI KAYDET
        </button>
      </form>
    </section>
  );
}
