"use client";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState, useEffect } from "react";
import { Camera as CameraIcon, Loader2, Check, X, Pencil } from "lucide-react";
import Tesseract from "tesseract.js";
import { addReceiptTransactionAction } from "@/actions/transaction";

export default function TakeReceiptButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedAmount, setDetectedAmount] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        setIsProcessing(true);
        const {
          data: { text },
        } = await Tesseract.recognize(
          `data:image/jpeg;base64,${image.base64String}`,
          "tur+eng"
        );

        // Metindeki rakamları bul ve en büyüğünü seç
        const matches = text.match(/\d+[\.,]\d{2}/g);
        if (matches) {
          const amounts = matches.map((m) => parseFloat(m.replace(",", ".")));
          setDetectedAmount(Math.max(...amounts).toFixed(2));
        } else {
          setDetectedAmount("0.00");
        }
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalSubmit = async () => {
    const amount = parseFloat(detectedAmount.replace(",", "."));
    if (amount > 0) {
      await addReceiptTransactionAction(amount, "Fiş Taraması");
      setShowConfirm(false);
      setDetectedAmount("");
      alert("Harcama başarıyla kaydedildi! 🐢💰");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full">
      {!showConfirm ? (
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
            {isProcessing ? "ANALİZ EDİLİYOR..." : "FOTOĞRAF ÇEK / FİŞ OKU"}
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-3 rounded-[2rem] bg-slate-50 dark:bg-slate-800 p-5 border-2 border-indigo-500 shadow-2xl animate-in fade-in zoom-in duration-300">
          <p className="text-center text-[10px] font-black text-indigo-500 uppercase tracking-widest">
            TUTARI KONTROL ET / DÜZELT
          </p>

          <div className="relative">
            <input
              type="text"
              value={detectedAmount}
              onChange={(e) => setDetectedAmount(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-3xl font-black text-center p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
            />
            <Pencil
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFinalSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-colors"
            >
              <Check size={20} /> KAYDET
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-colors"
            >
              <X size={20} /> İPTAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
