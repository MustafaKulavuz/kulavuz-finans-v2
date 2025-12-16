"use client";
import { addOrUpdateAsset } from "@/actions/asset";
import { Coins, Plus } from "lucide-react";

export default function AddAssetForm() {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="flex items-center gap-2 font-black text-slate-800 dark:text-white mb-6 uppercase text-sm tracking-widest">
        <Coins className="text-yellow-500" /> Varlık Miktarı Güncelle
      </h3>
      <form action={addOrUpdateAsset} className="grid gap-4">
        <div className="flex gap-3">
          <select
            name="type"
            className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none font-bold appearance-none"
          >
            <option value="USD">💵 USD (Dolar)</option>
            <option value="EUR">💶 EUR (Euro)</option>
            <option value="GOLD">🌕 GOLD (Gram Altın)</option>
          </select>
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Miktar"
            className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-100 dark:shadow-none">
          VARLIĞI KAYDET <Plus size={20} />
        </button>
      </form>
    </section>
  );
}
