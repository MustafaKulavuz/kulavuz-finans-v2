"use client";
import { addSubscription } from "@/actions/subscription";
import { Calendar, CreditCard, Plus } from "lucide-react";

export default function AddSubscriptionForm() {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="flex items-center gap-2 font-black text-slate-800 dark:text-white mb-6">
        <CreditCard className="text-indigo-500" /> Abonelik/Fatura Ekle
      </h3>
      <form action={addSubscription} className="grid gap-4">
        <input
          name="name"
          placeholder="Hizmet Adı (Örn: Netflix)"
          className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          required
        />
        <div className="flex gap-4">
          <input
            name="amount"
            type="number"
            placeholder="Tutar"
            className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
          />
          <input
            name="billingDay"
            type="number"
            min="1"
            max="31"
            placeholder="Gün (1-31)"
            className="w-24 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95">
          <Plus size={20} /> Listeye Ekle
        </button>
      </form>
    </section>
  );
}
