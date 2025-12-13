import { getTransactionById, updateTransaction } from "@/actions/transaction";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const transaction = await getTransactionById(resolvedParams.id);

  if (!transaction) {
    redirect("/"); // Harcama bulunamazsa ana sayfaya at
  }

  // updateTransaction fonksiyonuna ID'yi bağla
  const updateWithId = updateTransaction.bind(null, transaction.id);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative">
        {/* Geri Dön Butonu */}
        <Link
          href="/"
          className="absolute top-8 left-8 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-10">
          <h1 className="flex justify-center items-center gap-2 text-2xl font-black text-slate-900">
            Düzenle <Sparkles className="text-indigo-500" size={20} />
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2">
            Harcama detaylarını güncelle.
          </p>
        </div>

        <form action={updateWithId} className="space-y-6">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Kategori
            </label>
            <select
              name="category"
              defaultValue={transaction.category}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="Mutfak">🛒 Mutfak</option>
              <option value="Fatura">📄 Fatura</option>
              <option value="Eğlence">🎉 Eğlence</option>
              <option value="Sabit Gider">🏠 Sabit Gider</option>
              <option value="Ulaşım">🚗 Ulaşım</option>
              <option value="Giyim">👕 Giyim</option>
              <option value="Maaş">💰 Maaş</option>
              <option value="Ek Gelir">💵 Ek Gelir</option>
            </select>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Açıklama
            </label>
            <input
              name="description"
              defaultValue={transaction.description}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          {/* Tutar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tutar
            </label>
            <div className="relative">
              <input
                name="amount"
                type="number"
                defaultValue={transaction.amount}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
              <span className="absolute right-4 top-4 font-bold text-slate-400">
                ₺
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-2xl bg-indigo-600 py-4 font-black text-white shadow-xl shadow-indigo-200 transition-transform hover:scale-[1.02] active:scale-95"
          >
            GÜNCELLE
          </button>
        </form>
      </div>
    </div>
  );
}
