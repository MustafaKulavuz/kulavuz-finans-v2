"use client";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState } from "react";
import { Camera as CameraIcon, Loader2 } from "lucide-react";

export default function TakeReceiptButton() {
  const [isProcessing, setIsProcessing] = useState(false);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera, // Doğrudan kamerayı açar
      });

      if (image.base64String) {
        setIsProcessing(true);
        // Burada OCR (yazı okuma) işlemi tetiklenecek
        console.log("Fotoğraf çekildi, analiz başlıyor...");

        // Şimdilik sadece bir simülasyon yapalım
        setTimeout(() => {
          alert("Fiş başarıyla okundu: Market - 150 TL");
          setIsProcessing(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Kamera hatası:", error);
    }
  };

  return (
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
  );
}
