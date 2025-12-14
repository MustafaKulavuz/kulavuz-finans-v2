import { addTransaction, deleteTransaction } from "@/actions/transaction";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { checkAchievements } from "@/actions/achievements";
import AchievementEffect from "@/components/AchievementEffect"; // Konfeti bileşeni
import Link from "next/link";
import { getServerSession } from "next-auth";
import AiAdviceButton from "@/components/AiAdviceButton";
import AykutNotificationButton from "../components/AykutNotificationButton";
import TosbaaGame from "@/components/TosbaaGame";
import { authOptions } from "@/lib/auth";
import {
  Trash2,
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Sparkles,
  UserCircle,
  LogOut,
  Pencil,
  Trophy,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
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

  // 1. Başarı kontrolünü çalıştır ve sonucu al
  const newAchievement = await checkAchievements();

  // 2. Kullanıcı verisini çek
  const userData = await User.findOne({ email: session.user.email });
  const currentHealth = userData?.tosbaaHealth ?? 100;
  const achievements = userData?.achievements || [];

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

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* 🎉 Yeni başarı kazanıldıysa konfeti patlat */}
      <AchievementEffect isNew={!!newAchievement} />

      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white dark:bg-slate-900 p-6 md:p-0 rounded-[2rem] md:rounded-none shadow-sm md:shadow-none transition-colors text-slate-900 dark:text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-2xl">
              💲
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-2xl md:text-4xl font-black tracking-tight">
                Kulavuz Finans{" "}
                <Sparkles className="text-indigo-500" size={24} />
              </h1>
              <p className="font-medium text-slate-500 dark:text-slate-400 text-xs md:text-base">
                Finansal özgürlüğe ilk adım.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 pr-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                <UserCircle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  KULLANICI
                </span>
                <span className="font-bold leading-tight">
                  {session.user.name}
                </span>
              </div>
              <Link
                href="/api/auth/signout"
                className="ml-2 p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </Link>
            </div>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm min-w-[180px] text-center text-slate-900 dark:text-white">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                NET BAKİYE
              </p>
              <h2
                className={`text-3xl font-black ${
                  balance >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {balance.toLocaleString()} ₺
              </h2>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* 🐢 TOSBAA OYUN VE BAŞARI ALANI */}
            <section className="rounded-[2.5rem] bg-indigo-950 p-6 shadow-2xl border border-indigo-900 overflow-hidden relative">
              <TosbaaGame
                initialBalance={balance}
                initialHealth={currentHealth}
              />

              {/* 🏆 BAŞARI MADALYALARI */}
              {achievements.length > 0 && (
                <div className="mt-6 pt-6 border-t border-indigo-900/50">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                    <Trophy size={14} className="text-yellow-500" />
                    KAZANILAN MADALYALAR
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {achievements.map((ach: any) => (
                      <div
                        key={ach.id}
                        title={ach.description}
                        className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-900/40 border border-indigo-800 hover:border-yellow-500/50 transition-all cursor-help"
                      >
                        <span className="text-3xl group-hover:scale-125 transition-transform">
                          {ach.icon}
                        </span>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-bold">
                          {ach.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* İŞLEM EKLEME FORMU */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-black p-6 md:p-8 shadow-2xl transition-colors">
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
                  className="md:col-span-1 appearance-none rounded-2xl border-none bg-slate-800 dark:bg-slate-900 p-4 font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="md:col-span-2 rounded-2xl border-none bg-slate-800 dark:bg-slate-900 p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div className="relative md:col-span-1">
                  <input
                    name="amount"
                    type="number"
                    placeholder="Tutar"
                    className="w-full rounded-2xl border-none bg-slate-800 dark:bg-slate-900 p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
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

            {/* LİSTE */}
            <section className="overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100">
              <div className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                Son Hareketler
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {data.map((t) => {
                  const deleteWithId = deleteTransaction.bind(
                    null,
                    t._id.toString()
                  );
                  return (
                    <div
                      key={t._id.toString()}
                      className="group flex items-center justify-between p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
                          <p className="font-bold">{t.description}</p>
                          <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                        <span
                          className={`text-xl font-black ${
                            t.type === "INCOME" ? "text-emerald-600" : ""
                          }`}
                        >
                          {t.type === "INCOME" ? "+" : "-"}
                          {t.amount.toLocaleString()} ₺
                        </span>
                        <Link
                          href={`/edit/${t._id.toString()}`}
                          className="rounded-xl p-2 text-slate-300 hover:text-indigo-600"
                        >
                          <Pencil size={18} />
                        </Link>
                        <form action={deleteWithId}>
                          <button
                            type="submit"
                            className="rounded-xl p-2 text-slate-300 hover:text-rose-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <AiAdviceButton income={totalIncome} expense={totalExpense} />
            <div className="mt-6">
              <AykutNotificationButton
                balance={balance}
                expense={totalExpense}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
