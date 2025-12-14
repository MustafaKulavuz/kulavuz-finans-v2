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

  // --- AKILLI VE SESLİ BİLDİRİM MOTORU ---
  const akilliPlanlamaYap = async () => {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );

    // 1. Ses Kanalı Oluştur (Android 8+ için şart)
    await LocalNotifications.createChannel({
      id: "aykut_sesli_yeni",
      name: "Aykut Sesli Uyarılar",
      importance: 5,
      sound: "aykut_ses.mp3", // raw klasöründeki dosya adı
      vibration: true,
      visibility: 1,
    });

    // 2. Eski planları temizle
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    let bildirimler = [];
    let modAdi = "";

    // 3. Duruma Göre Senaryo Belirle
    if (balance < 0) {
      modAdi = "İFLAS MODU 🚨";
      bildirimler = [
        {
          title: "BATTIK BATTIK!",
          body: `Şu an ${balance} TL içerdesin. Kendine gel!`,
          saatSonra: 0.01,
        }, // Test için hemen (36 saniye sonra)
        {
          title: "Hala harcıyor musun?",
          body: "Borç yiğidin kamçısıdır dedik de abarttın.",
          saatSonra: 4,
        },
      ];
    } else if (balance < 2000) {
      modAdi = "TASARRUF MODU ⚠️";
      bildirimler = [
        {
          title: "Limitler Zorlanıyor",
          body: `Cebinde sadece ${balance} TL kaldı.`,
          saatSonra: 0.01,
        },
        {
          title: "Gereksiz Harcama Yapma",
          body: "O kahveyi evde içsen ölmezsin.",
          saatSonra: 6,
        },
      ];
    } else {
      modAdi = "KEYİF MODU 😎";
      bildirimler = [
        {
          title: "Durumlar İyi",
          body: `Kasa sağlam (${balance} TL). Ama şımarma.`,
          saatSonra: 0.01,
        },
        {
          title: "Yatırım Tavsiyesi",
          body: "Paran varken biriktir.",
          saatSonra: 12,
        },
      ];
    }

    // 4. Bildirimleri Sesli Olarak Planla
    const scheduleList = bildirimler.map((notif, index) => ({
      title: notif.title,
      body: notif.body,
      id: 100 + index,
      schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * notif.saatSonra) },
      sound: "aykut_ses.mp3", // Ses dosyası
      channelId: "aykut_sesli_yeni", // Kanal bağlantısı
    }));

    await LocalNotifications.schedule({ notifications: scheduleList });
    alert(`Aykut Modu: ${modAdi}\nSesli uyarılar planlandı! 🐢🔊`);
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
        await akilliPlanlamaYap();
        localStorage.setItem("aykutModu", "aktif");
        setOtomatikMod(true);
      } else {
        const pending = await LocalNotifications.getPending();
        await LocalNotifications.cancel(pending);
        localStorage.setItem("aykutModu", "pasif");
        setOtomatikMod(false);
        alert("Mod kapatıldı.");
      }
    }
  };

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
      <span>
        {otomatikMod ? "AKILLI MOD: AÇIK (SESLİ)" : "AKILLI SESLİ MODU AÇ"}
      </span>
    </button>
  );
}
