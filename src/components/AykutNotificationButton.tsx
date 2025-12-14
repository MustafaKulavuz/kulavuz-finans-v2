"use client";
import { useEffect, useState } from "react";
import { BellRing, BellOff, BrainCircuit } from "lucide-react";

interface Props {
  balance: number;
  expense: number;
}

export default function AykutNotificationButton({ balance, expense }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [otomatikMod, setOtomatikMod] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkStatus = localStorage.getItem("aykutModu");
    if (checkStatus === "aktif") setOtomatikMod(true);
  }, []);

  // --- AKILLI BİLDİRİM MOTORU ---
  const akilliPlanlamaYap = async () => {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );

    // 1. Önce eski planları temizle
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    let bildirimler = [];
    let modAdi = "";

    // 2. Duruma Göre Senaryo Seç
    if (balance < 0) {
      // --- KIRMIZI ALARM MODU (Çok Sıkı) ---
      modAdi = "İFLAS MODU 🚨";
      bildirimler = [
        {
          title: "BATTIK BATTIK!",
          body: `Şu an ${balance} TL içerdesin. Kendine gel!`,
          saatSonra: 2,
        },
        {
          title: "Hala harcıyor musun?",
          body: "Borç yiğidin kamçısıdır dedik de abarttın.",
          saatSonra: 5,
        },
        {
          title: "Gece Raporu",
          body: "Bugün hiç harcama yapma, rica ediyorum.",
          saatSonra: 10,
        },
        {
          title: "Günaydın Borçlu",
          body: "Uyan ve borçlarını öde.",
          saatSonra: 24,
        },
      ];
    } else if (balance < 2000) {
      // --- DİKKAT MODU (Orta) ---
      modAdi = "TASARRUF MODU ⚠️";
      bildirimler = [
        {
          title: "Limitler Zorlanıyor",
          body: `Cebinde sadece ${balance} TL kaldı. Dikkat et.`,
          saatSonra: 4,
        },
        {
          title: "Gereksiz Harcama Yapma",
          body: "O kahveyi evde içsen ölmezsin.",
          saatSonra: 8,
        },
        {
          title: "Durum Kontrolü",
          body: "Hala ay sonunu getirebiliriz, dayan!",
          saatSonra: 24,
        },
      ];
    } else {
      // --- RAHAT MOD (Düşük) ---
      modAdi = "KEYİF MODU 😎";
      bildirimler = [
        {
          title: "Durumlar İyi",
          body: `Kasa sağlam (${balance} TL). Ama şımarma.`,
          saatSonra: 6,
        },
        {
          title: "Yatırım Tavsiyesi",
          body: "Paran varken biriktir, harcarken değil.",
          saatSonra: 24,
        },
      ];
    }

    // 3. Bildirimleri Zamanla (Schedule)
    // 3. Bildirimleri Zamanla (Schedule)
    const scheduleList = bildirimler.map((notif, index) => ({
      title: notif.title,
      body: notif.body,
      id: 100 + index,
      schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * notif.saatSonra) },
      // sound satırını tamamen kaldırdık, artık kızmayacak!
    }));

    await LocalNotifications.schedule({ notifications: scheduleList });
    alert(
      `Aykut Modu Güncellendi: ${modAdi}\nDurumuna göre ${scheduleList.length} adet uyarı planlandı.`
    );
  };

  const moduDegistir = async () => {
    if (!isClient) return;
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== "granted")
      permission = await LocalNotifications.requestPermissions();

    if (permission.display === "granted") {
      if (!otomatikMod) {
        // Açarken planla
        await akilliPlanlamaYap();
        localStorage.setItem("aykutModu", "aktif");
        setOtomatikMod(true);
      } else {
        // Kapatırken her şeyi iptal et
        const pending = await LocalNotifications.getPending();
        await LocalNotifications.cancel(pending);
        localStorage.setItem("aykutModu", "pasif");
        setOtomatikMod(false);
        alert("Mod kapatıldı, bildirimler iptal edildi.");
      }
    }
  };

  // Eğer mod zaten açıksa ve bakiye değiştiyse, sessizce planı güncelle (useEffect)
  useEffect(() => {
    if (isClient && otomatikMod) {
      akilliPlanlamaYap().catch(console.error);
    }
  }, [balance, expense]); // Bakiye değişince tetiklenir

  if (!isClient) return null;

  return (
    <button
      onClick={moduDegistir}
      className={`mt-6 w-full flex items-center justify-center gap-2 rounded-[2.5rem] p-6 font-black shadow-xl transition-transform hover:scale-[1.02] active:scale-95 text-white ${
        otomatikMod
          ? "bg-indigo-600 shadow-indigo-200"
          : "bg-slate-600 shadow-slate-200"
      }`}
    >
      {otomatikMod ? (
        <BrainCircuit size={24} className="animate-pulse" />
      ) : (
        <BellOff size={24} />
      )}
      <span>{otomatikMod ? "AKILLI MOD: AÇIK" : "AKILLI MODU AÇ"}</span>
    </button>
  );
}
