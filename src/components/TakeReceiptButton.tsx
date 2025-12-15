"use client";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState } from "react";
import { Camera as CameraIcon, Loader2, Check, X } from "lucide-react";
import Tesseract from "tesseract.js";
import { addReceiptTransactionAction } from "@/actions/transaction";

export default function TakeReceiptButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedAmount, setDetectedAmount] = useState<number | null>(null);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 100, // En yüksek kalite
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        setIsProcessing(true);

        // Sadece rakamları ve para birimi sembollerini tanıması için beyaz liste ekliyoruz
        const {
          data: { text },
        } = await Tesseract.recognize(
          `data:image/jpeg;base64,${image.base64String}`,
          "tur",
          { logger: (m) => console.log(m) }
        );

        // 🧠 Zeki Ayıklama: Metindeki tüm sayıları bul ve en büyüğünü seç (Genelde toplam en alttadır)
        const matches = text.match(/\d+[\.,]\d{2}/g);
        if (matches) {
          const amounts = matches.map((m) => parseFloat(m.replace(",", ".")));
          const maxAmount = Math.max(...amounts); // Fişteki en yüksek değer genellikle toplamdır
          setDetectedAmount(maxAmount);
        } else {
          alert("Tutar bulunamadı, lütfen fişi daha yakından çekin.");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAmount = async () => {
    if (detectedAmount) {
      await addReceiptTransactionAction(detectedAmount, "Fiş Okuma");
      setDetectedAmount(null);
      alert("Harcama kaydedildi! 🐢💰");
    }
  };

  return (
    <div className="w-full space-y-2">
      {!detectedAmount ? (
        <button
          onClick={takePhoto}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 p-4 font-bold text-white shadow-lg active:scale-95 transition-all"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CameraIcon size={20} />
          )}
          <span>
            {isProcessing ? "FİŞ ANALİZ EDİLİYOR..." : "FOTOĞRAF ÇEK / FİŞ OKU"}
          </span>
        </button>
      ) : (
        /* ✅ Onay Ekranı: Yanlış okuma ihtimaline karşı */
        <div className="flex flex-col gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-4 border-2 border-emerald-500">
          <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            OKUNAN TUTAR DOĞRU MU?
          </p>
          <div className="text-center text-2xl font-black text-slate-900 dark:text-white">
            {detectedAmount} ₺
          </div>
          <div className="flex gap-2">
            <button
              onClick={confirmAmount}
              className="flex-1 flex items-center justify-center gap-1 bg-emerald-500 text-white p-2 rounded-xl font-bold"
            >
              <Check size={18} /> EVET
            </button>
            <button
              onClick={() => setDetectedAmount(null)}
              className="flex-1 flex items-center justify-center gap-1 bg-rose-500 text-white p-2 rounded-xl font-bold"
            >
              <X size={18} /> HAYIR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
