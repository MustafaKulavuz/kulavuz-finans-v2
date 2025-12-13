import { addTransaction, deleteTransaction } from "@/actions/transaction";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Trash2,
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Sparkles,
  PieChart as PieIcon,
  UserCircle,
  LogOut,
  Pencil,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <h1 className="text-2xl font-black text-slate-900">
          Önce Giriş Yapmalısın 🔒
        </h1>
        <Link
          href="/login"
          className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-500"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  await connectDB();
  const data = await Transaction.find({ userEmail: session.user.email }).sort({
    date: -1,
  });

  const totalIncome = data
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = data
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryData = data
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc: any, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white md:bg-transparent p-6 md:p-0 rounded-[2rem] md:rounded-none shadow-sm md:shadow-none">
          <div className="flex items-center gap-4">
            <img
              src="/favicon.ico"
              alt="Logo"
              className="h-12 md:h-16 w-auto object-contain opacity-90"
            />
            <div>
              <h1 className="flex items-center gap-2 text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                Kılavuz Finans{" "}
                <Sparkles className="text-indigo-500" size={24} />
              </h1>
              <p className="font-medium text-slate-500 text-xs md:text-base">
                Finansal özgürlüğe ilk adım.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-4">
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                <UserCircle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  KULLANICI
                </span>
                <span className="font-bold text-slate-900 leading-tight">
                  {session.user.name}
                </span>
              </div>
              <Link
                href="/api/auth/signout"
                className="ml-2 p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </Link>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm min-w-[180px]">
              <p className="mb-1 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                NET BAKİYE
              </p>
              <h2
                className={`text-center text-3xl font-black ${
                  balance >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {balance.toLocaleString()} ₺
              </h2>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* EKLEME FORMU */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-6 md:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
              <h3 className="relative mb-6 flex items-center gap-2 text-lg font-bold text-white">
                <PlusCircle className="text-indigo-400" size={24} /> Yeni İşlem
                Ekle
              </h3>
              <form
                action={addTransaction}
                className="relative grid gap-4 md:grid-cols-4"
              >
                <select
                  name="category"
                  className="md:col-span-1 cursor-pointer appearance-none rounded-2xl border-none bg-slate-800 p-4 font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
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
                <input
                  name="description"
                  placeholder="Açıklama"
                  className="md:col-span-2 rounded-2xl border-none bg-slate-800 p-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div className="relative md:col-span-1">
                  <input
                    name="amount"
                    type="number"
                    placeholder="Tutar"
                    className="w-full rounded-2xl border-none bg-slate-800 p-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <span className="absolute right-4 top-4 font-bold text-slate-500">
                    ₺
                  </span>
                </div>
                <button
                  type="submit"
                  className="md:col-span-4 mt-2 rounded-2xl bg-indigo-500 py-4 font-black text-white transition-transform hover:scale-[1.02] active:scale-95"
                >
                  KAYDET
                </button>
              </form>
            </section>

            {/* GÜNCELLENMİŞ LİSTE (Tarih ve Düzenle Butonu Eklendi) */}
            <section className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-50 bg-slate-50/50 p-6 text-xs font-black uppercase tracking-widest text-slate-400">
                Son Hareketler
              </div>
              <div className="divide-y divide-slate-50">
                {data.map((t) => {
                  const deleteWithId = deleteTransaction.bind(
                    null,
                    t._id.toString()
                  );
                  // Tarihi formatla (Örn: 13 Aralık 2025)
                  const formattedDate = new Date(t.date).toLocaleDateString(
                    "tr-TR",
                    { day: "numeric", month: "long" }
                  );

                  return (
                    <div
                      key={t._id.toString()}
                      className="group flex items-center justify-between p-6 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                            t.type === "INCOME"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {t.type === "INCOME" ? (
                            <TrendingUp size={24} />
                          ) : (
                            <TrendingDown size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {t.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {t.category}
                            </span>
                            {/* YENİ: Tarih Göstergesi */}
                            <span className="text-[10px] text-slate-400 font-medium">
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xl font-black ${
                            t.type === "INCOME"
                              ? "text-emerald-600"
                              : "text-slate-900"
                          }`}
                        >
                          {t.type === "INCOME" ? "+" : "-"}
                          {t.amount.toLocaleString()} ₺
                        </span>

                        {/* YENİ: Düzenle Butonu */}
                        <Link
                          href={`/edit/${t._id.toString()}`}
                          className="rounded-xl p-2 text-slate-300 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Pencil size={18} />
                        </Link>

                        <form action={deleteWithId}>
                          <button
                            type="submit"
                            className="rounded-xl p-2 text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
                {data.length === 0 && (
                  <div className="p-12 text-center text-slate-400 font-medium italic">
                    Hiç kaydın yok. Yeni bir tane ekle!
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                <PieIcon size={16} className="text-indigo-500" /> Harcama
                Analizi
              </h3>
              <div className="space-y-5">
                {Object.entries(categoryData).map(([cat, amt]: any) => (
                  <div key={cat} className="group">
                    <div className="flex justify-between text-sm mb-2 font-bold text-slate-600">
                      <span>{cat}</span>
                      <span className="text-slate-900">
                        {amt.toLocaleString()} ₺
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000 group-hover:bg-indigo-400"
                        style={{
                          width: `${Math.min(
                            (amt / (totalExpense || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <div className="flex h-40 flex-col justify-between rounded-[2.5rem] bg-emerald-500 p-8 text-white shadow-xl shadow-emerald-200">
              <div className="flex items-center gap-2 opacity-80">
                <TrendingUp size={20} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Toplam Gelir
                </span>
              </div>
              <p className="text-4xl font-black tracking-tighter">
                {totalIncome.toLocaleString()} ₺
              </p>
            </div>
            <div className="flex h-40 flex-col justify-between rounded-[2.5rem] bg-rose-500 p-8 text-white shadow-xl shadow-rose-200">
              <div className="flex items-center gap-2 opacity-80">
                <TrendingDown size={20} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Toplam Gider
                </span>
              </div>
              <p className="text-4xl font-black tracking-tighter">
                {totalExpense.toLocaleString()} ₺
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
