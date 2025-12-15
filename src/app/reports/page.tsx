"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ArrowLeft, TrendingDown, ShoppingBag, Info } from "lucide-react";
import Link from "next/link";

// Grafik Renk Paleti
const COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function ReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verileri API'den veya Transaction modelinden çekme simülasyonu
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions"); // Bu API'yi sonraki adımda yapabiliriz
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Harcamaları kategorilere göre grupla
  const expenseData = data
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc: any[], curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">
        Raporlar Hazırlanıyor... 🐢📊
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* ÜST NAVİGASYON */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-indigo-500 font-bold hover:underline"
          >
            <ArrowLeft size={20} /> Geri Dön
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Finansal Analiz 📊
          </h1>
        </div>

        {/* ÖZET KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 text-xs font-bold uppercase">
              En Çok Harcanan Kategori
            </p>
            <p className="text-2xl font-black text-rose-500 mt-1">
              {expenseData.length > 0
                ? expenseData.sort((a, b) => b.value - a.value)[0].name
                : "Veri Yok"}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 text-xs font-bold uppercase">
              Toplam Gider
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {expenseData
                .reduce((acc, curr) => acc + curr.value, 0)
                .toLocaleString()}{" "}
              ₺
            </p>
          </div>
        </div>

        {/* PASTA GRAFİĞİ */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-[400px]">
          <h2 className="text-center font-bold text-slate-500 mb-4 uppercase text-xs tracking-widest">
            Gider Dağılımı
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "15px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* TOSBAA'NIN NOTU */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[2rem] flex items-start gap-4 border border-indigo-100 dark:border-indigo-900/50">
          <div className="text-3xl">🐢</div>
          <div className="space-y-1">
            <p className="font-bold text-indigo-900 dark:text-indigo-300">
              Tosbaa'nın Aylık Tavsiyesi
            </p>
            <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 italic">
              "Görüyorum ki harcamaların çoğu{" "}
              {expenseData[0]?.name.toLowerCase()} tarafına gitmiş. Belki de
              haftaya dışarıdan yemek yerine evde yaparsın? 🍕➡️🥗"
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
