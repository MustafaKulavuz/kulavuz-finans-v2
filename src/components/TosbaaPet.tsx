"use client";
// health prop'unu buraya ekledik
export default function TosbaaPet({
  balance,
  health = 100,
}: {
  balance: number;
  health?: number;
}) {
  const mood = balance >= 5000 ? "rich" : balance > 0 ? "happy" : "sad";

  return (
    <div className="text-center text-white">
      {/* Can Barı - health değiştikçe burası da değişir */}
      <div className="mb-4 px-2">
        <div className="flex justify-between text-[10px] font-bold mb-1 text-indigo-300">
          <span>ENERJİ</span>
          <span>%{health}</span>
        </div>
        <div className="w-full bg-indigo-950 h-3 rounded-full overflow-hidden border border-indigo-800 shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ${
              health > 50
                ? "bg-emerald-500"
                : health > 20
                ? "bg-amber-500"
                : "bg-rose-600 animate-pulse"
            }`}
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>
      <div className="text-8xl">
        {mood === "rich" ? "😎" : mood === "happy" ? "🐢" : "🤒"}
      </div>
    </div>
  );
}
