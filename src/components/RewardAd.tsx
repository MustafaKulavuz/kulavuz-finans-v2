"use client";
import { AdMob, RewardAdOptions } from "@capacitor-community/admob";
import { useState, useEffect } from "react";
import { PlayCircle, Loader2 } from "lucide-react";
// 👇 BURAYI DEĞİŞTİRDİK: Para düşürmeyen yeni aksiyonu çağırıyoruz
import { rewardFeedAction } from "@/actions/transaction";

export default function RewardAdButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Hydration hatasını önlemek için

  useEffect(() => {
    setIsMounted(true);
    AdMob.initialize(); // Reklam motorunu başlat
  }, []);

  const showRewardAd = async () => {
    setIsLoading(true);
    try {
      const options: RewardAdOptions = {
        adId: "ca-app-pub-3940256099942544/5224354917", // Test ID
      };

      await AdMob.prepareRewardVideoAd(options); // Reklamı hazırla
      const rewardItem = await AdMob.showRewardVideoAd(); // Reklamı göster

      if (rewardItem) {
        // 👇 BURAYI DEĞİŞTİRDİK: Bedava besleme fonksiyonu çalışır
        await rewardFeedAction();
        alert("Tebrikler! Reklam izlediğin için Tosbaa bedavaya doydu. 🐢🍕");
      }
    } catch (error) {
      console.error("Reklam hatası:", error);
      alert("Reklam şu an hazır değil, lütfen az sonra tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null; // Sunucu-istemci uyumsuzluğunu önler

  return (
    <button
      onClick={showRewardAd}
      disabled={isLoading}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-indigo-500 p-3 font-bold text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-95 bg-white dark:bg-slate-900 shadow-sm"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <PlayCircle size={18} />
      )}
      <span>
        {isLoading ? "REKLAM YÜKLENİYOR..." : "REKLAM İZLE VE CAN VER (+20)"}
      </span>
    </button>
  );
}
