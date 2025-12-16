import {
  addTransaction,
  deleteTransaction,
  resetMonthlyExpenses,
} from "@/actions/transaction";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { Asset } from "@/models/Asset";
import { Subscription } from "@/models/Subscription";
import { checkAchievements } from "@/actions/achievements";
import AchievementEffect from "@/components/AchievementEffect";
import RewardAdButton from "@/components/RewardAd";
import TakeReceiptButton from "@/components/TakeReceiptButton";
import BannerAd from "@/components/BannerAd";
import Link from "next/link";
import { getServerSession } from "next-auth";
import AiAdviceButton from "@/components/AiAdviceButton";
import AykutNotificationButton from "../components/AykutNotificationButton";
import TosbaaGame from "@/components/TosbaaGame";
import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import AddAssetForm from "@/components/AddAssetForm";
import { authOptions } from "@/lib/auth";
import { getExchangeRates } from "@/lib/exchange";
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
  BarChart3,
  ArrowRight,
  Wallet,
  CalendarClock,
  Coins,
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
  await resetMonthlyExpenses();

  const newAchievement = await checkAchievements();
  const userData = await User.findOne({ email: session.user.email });
  const currentHealth = userData?.tosbaaHealth ?? 100;
  const achievements = userData?.achievements || [];

  // Verileri çekme
  const data = await Transaction.find({ userEmail: session.user.email }).sort({
    date: -1,
  });
  const userAssets = await Asset.find({ userEmail: session.user.email });
  const activeSubs = await Subscription.find({
    userEmail: session.user.email,
    active: true,
  });
  const rates = await getExchangeRates();

  // Hesaplamalar
  const today = new Date().toDateString();
  const todayExpenses = data
    .filter(
      (t) => t.type === "EXPENSE" && new Date(t.date).toDateString() === today
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = data
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = data
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Dövizli Varlık Toplamı Hesaplama
  const totalAssetsInTry = userAssets.reduce((acc, asset) => {
    const rate = rates[asset.type as keyof typeof rates] || 1;
    return acc + asset.amount * rate;
  }, 0);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
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
              <p className="font-medium text-slate-500 dark:text-slate-400 text-xs md:text-base italic">
                {totalAssetsInTry > 0
                  ? `Toplam Portföyün: ${totalAssetsInTry.toLocaleString()} ₺ 🏛️`
                  : "Finansal özgürlüğe ilk adım."}
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 pr-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl text-indigo-600">
                <UserCircle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  KULLANICI
                </span>
                <span className="font-bold leading-tight">
                  {session.user.name}
                </span>
              </div>
              <Link
                href="/api/auth/signout"
                className="ml-2 p-2 text-rose-400 hover:bg-rose-50 rounded-lg"
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
            {/* 💰 DÖVİZ VE VARLIK PANELİ */}
            <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group border border-white/5">
              <Wallet className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="flex items-center gap-2 font-black text-white text-lg">
                    <Coins className="text-yellow-400" /> Cüzdan & Varlıklar
                  </h3>
                  <div className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full text-indigo-200 uppercase">
                    USD: {rates.USD.toFixed(2)} ₺ | EUR: {rates.EUR.toFixed(2)}{" "}
                    ₺
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userAssets.length > 0 ? (
                    userAssets.map((asset) => (
                      <div
                        key={asset._id}
                        className="bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <p className="text-[10px] font-black text-indigo-300 uppercase">
                          {asset.type}
                        </p>
                        <p className="text-xl font-black text-white">
                          {asset.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-emerald-400 font-bold">
                          ≈{" "}
                          {(
                            (rates[asset.type as keyof typeof rates] || 1) *
                            asset.amount
                          ).toLocaleString()}{" "}
                          ₺
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 py-4 text-center text-slate-500 text-xs font-bold border-2 border-dashed border-white/5 rounded-3xl">
                      Henüz döviz veya altın varlığı eklenmedi.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* FORM ALANI: VARLIK VE ABONELİK */}
            <div className="grid gap-6 md:grid-cols-2">
              <AddAssetForm />
              <AddSubscriptionForm />
            </div>

            {/* ⚠️ GÜNLÜK LİMİT UYARISI */}
            {todayExpenses > 500 && (
              <div className="animate-bounce bg-rose-600 text-white p-4 rounded-2xl flex items-center justify-between font-black shadow-lg">
                <span>
                  📢 GÜNLÜK 500 TL LİMİTİ AŞILDI! (
                  {todayExpenses.toLocaleString()} ₺)
                </span>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `(function() { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(440, ctx.currentTime); osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.5); })();`,
                  }}
                />
              </div>
            )}

            {/* 📊 ANALİZ KARTI */}
            <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <BarChart3 className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
              <div className="relative z-10 space-y-4">
                <p className="text-3xl font-black uppercase tracking-tighter">
                  Nereye Gidiyor Bu Paralar?
                </p>
                <Link
                  href="/reports"
                  className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black text-sm hover:shadow-2xl active:scale-95 transition-all"
                >
                  DETAYLI RAPORU GÖR <ArrowRight size={18} />
                </Link>
              </div>
            </section>

            {/* 🐢 TOSBAA OYUN */}
            <section className="rounded-[2.5rem] bg-indigo-950 p-6 shadow-2xl border border-indigo-900 overflow-hidden relative">
              <TosbaaGame
                initialBalance={balance}
                initialHealth={currentHealth}
              />
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RewardAdButton />
                  <TakeReceiptButton />
                </div>
                <BannerAd />
              </div>
            </section>

            {/* LİSTE */}
            <section className="overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white">
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
                          <p className="font-bold text-slate-900 dark:text-white">
                            {t.description}
                          </p>
                          <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
                            {t.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xl font-black ${
                            t.type === "INCOME"
                              ? "text-emerald-600"
                              : "text-rose-600"
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
            {/* TOSBAA AI TAVSİYE BUTONU: Veriler artık gidiyor */}
            <AiAdviceButton
              income={totalIncome}
              expense={totalExpense}
              assets={userAssets}
              rates={rates}
            />
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
