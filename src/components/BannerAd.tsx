"use client";
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdOptions,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";

export default function BannerAd() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const initializeBanner = async () => {
      if (Capacitor.getPlatform() !== "web") {
        // 📱 Mobil için AdMob Banner
        await AdMob.initialize();
        const options: BannerAdOptions = {
          adId: "ca-app-pub-5619569366075074/5847712645", // Kendi Banner ID'ni buraya yaz
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false, // Canlıya alırken false yap
        };
        await AdMob.showBanner(options);
      }
    };

    initializeBanner();

    // Sayfadan çıkınca reklamı gizle
    return () => {
      if (Capacitor.getPlatform() !== "web") {
        AdMob.hideBanner();
      }
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full py-2 flex justify-center bg-slate-50 dark:bg-slate-950">
      {Capacitor.getPlatform() === "web" ? (
        /* 🌐 Tarayıcı (Chrome) için AdSense veya görsel alan */
        <div className="w-[320px] h-[50px] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 rounded-lg border border-dashed border-slate-400">
          REKLAM ALANI (ADSENSE)
        </div>
      ) : (
        /* Mobilde AdMob banner'ı yer kaplamasın diye boş div */
        <div className="h-[50px]" />
      )}
    </div>
  );
}
