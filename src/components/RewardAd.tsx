"use client";
import { AdMob, RewardAdOptions } from "@capacitor-community/admob";
import { useState, useEffect } from "react";
import { PlayCircle, Loader2 } from "lucide-react";
import { rewardFeedAction } from "@/actions/transaction"; // Bedava besleme aksiyonu

export default function RewardAdButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    AdMob.initialize(); // AdMob motorunu başlatır
  }, []);

  const showRewardAd = async () => {
    setIsLoading(true);
    try {
      const options: RewardAdOptions = {
        // 👇 GERÇEK REKLAM BİRİMİ KİMLİĞİN BURAYA EKLENDİ
        adId: "ca-app-pub-5619569366075074/5847712645",
      };

      await AdMob.prepareRewardVideoAd(options); // Reklamı sunucudan çeker
      const rewardItem = await AdMob.showRewardVideoAd(); // Kullanıcıya gösterir

      if (rewardItem) {
        // Reklam tam izlendiğinde veritabanında canı artırır
        await rewardFeedAction();
        alert("Tebrikler! Reklam izlediğin için Tosbaa bedavaya doydu. 🐢🍕");
      }
    } catch (error) {
      console.error("Reklam hatası:", error);
      alert("Şu an reklam hazır değil, lütfen biraz sonra tekrar deneyin.");
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
        {isLoading ? "REKLAM YÜKLENİYOR..." : "REKLAM İZLE VE CAN VER (+20)"}
      </span>
    </button>
  );
}
