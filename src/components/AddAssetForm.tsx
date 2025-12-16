"use client";
import { addOrUpdateAsset } from "@/actions/asset";
import { Coins, Plus } from "lucide-react";

export default function AddAssetForm() {
  async function handleSubmit(formData: FormData) {
    try {
      await addOrUpdateAsset(formData);
      alert("Varlık başarıyla güncellendi! ✅");
    } catch (error) {
      alert("Hata: Varlık kaydedilemedi.");
    }
  }

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="flex items-center gap-2 font-black text-slate-800 dark:text-white mb-6 uppercase text-sm tracking-widest">
        <Coins className="text-yellow-500" /> Varlık Miktarı Güncelle
      </h3>
      <form action={handleSubmit} className="grid gap-4">
        {/* ... inputlar aynı kalıyor ... */}
        <button
          type="submit"
          className="bg-emerald-600 text-white font-black p-4 rounded-2xl active:scale-95 transition-transform"
        >
          VARLIĞI KAYDET <Plus size={20} />
        </button>
      </form>
    </section>
  );
}
