"use client";
import {
  AdMob,
  RewardAdOptions,
  RewardAdPluginEvents,
  AdMobRewardItem,
} from "@capacitor-community/admob";
import { useState, useEffect } from "react";
import { PlayCircle, Loader2 } from "lucide-react";
import { feedTosbaaAction } from "@/actions/transaction"; // Besleme fonksiyonumuz

export default function RewardAdButton() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AdMob.initialize(); // Reklam motorunu başlat
  }, []);

  const showRewardAd = async () => {
    setIsLoading(true);
    try {
      const options: RewardAdOptions = {
        adId: "ca-app-pub-3940256099942544/5224354917", // GOOGLE TEST ID (Güvenlidir)
      };

      await AdMob.prepareRewardVideoAd(options); // Reklamı hazırla
      const rewardItem = await AdMob.showRewardVideoAd(); // Reklamı göster

      if (rewardItem) {
        // Reklam başarıyla izlendi, Tosbaa'yı bedavaya besle!
        await feedTosbaaAction();
        alert("Tebrikler! Reklam izlediğin için Tosbaa bedavaya doydu. 🐢🍕");
      }
    } catch (error) {
      console.error("Reklam hatası:", error);
      alert("Reklam şu an yüklenemedi, sonra tekrar dene.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={showRewardAd}
      disabled={isLoading}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-indigo-500 p-3 font-bold text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
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
