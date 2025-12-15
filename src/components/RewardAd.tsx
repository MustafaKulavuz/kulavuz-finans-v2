"use client";
import { AdMob, RewardAdOptions } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core"; // Platform kontrolü için
import { useState, useEffect } from "react";
import { PlayCircle, Loader2 } from "lucide-react";
import { rewardFeedAction } from "@/actions/transaction";

export default function RewardAdButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (Capacitor.getPlatform() !== "web") {
      AdMob.initialize();
    }
  }, []);

  const showRewardAd = async () => {
    // 🌍 Tarayıcıda (Chrome) reklamı engelle
    if (Capacitor.getPlatform() === "web") {
      alert(
        "Reklamlar sadece mobil uygulamada (APK) izlenebilir. Chrome'da reklam gösterilemez."
      );
      return;
    }

    setIsLoading(true);
    try {
      const options: RewardAdOptions = {
        adId: "ca-app-pub-5619569366075074/5847712645", // Canlı reklam ID'n
      };

      await AdMob.prepareRewardVideoAd(options);
      const rewardItem = await AdMob.showRewardVideoAd();

      if (rewardItem) {
        await rewardFeedAction();
        alert("Reklam başarıyla izlendi! 🐢🍕");
      }
    } catch (error) {
      console.error("Reklam hatası:", error);
      alert("Şu an reklam hazır değil. Lütfen gerçek bir cihazda deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

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
        {isLoading ? "YÜKLENİYOR..." : "REKLAM İZLE VE CAN VER (+20)"}
      </span>
    </button>
  );
}
