"use client";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState } from "react";
import { Camera as CameraIcon, Loader2 } from "lucide-react";
import Tesseract from "tesseract.js"; // Yazı okuma kütüphanesi
import { addReceiptTransactionAction } from "@/actions/transaction"; // Otomatik harcama fonksiyonu

export default function TakeReceiptButton() {
  const [isProcessing, setIsProcessing] = useState(false);

  const takePhoto = async () => {
    try {
      // 1. Kamerayı Aç ve Fotoğraf Çek
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        setIsProcessing(true);
        console.log("Analiz başlıyor...");

        // 2. OCR (Yazı Tanıma) İşlemi
        // Fotoğraftaki metinleri Türkçe ve İngilizce sözlükle tarar
        const {
          data: { text },
        } = await Tesseract.recognize(
          `data:image/jpeg;base64,${image.base64String}`,
          "tur+eng"
        );

        console.log("Okunan Metin:", text);

        // 3. Metin İçinden Tutarı Ayıkla (Regex)
        // Örnek: "Toplam: 150,50" içindeki sayıyı bulur
        const amountMatch = text.match(/(\d+[\.,]\d{2})/);
        const amount = amountMatch
          ? parseFloat(amountMatch[0].replace(",", "."))
          : 0;

        if (amount > 0) {
          // 4. Veritabanına Kaydet ve Bakiyeyi Düş
          const result = await addReceiptTransactionAction(
            amount,
            "Fiş Taraması"
          );

          if (result?.success) {
            alert(
              `Başarılı! ${amount} ₺ tutarındaki fiş kaydedildi ve bakiyeden düşüldü. 🐢✅`
            );
          }
        } else {
          alert(
            "Fiş okundu ancak ödenecek tutar net olarak saptanamadı. Lütfen manuel ekleyin."
          );
        }
      }
    } catch (error) {
      console.error("Kamera veya OCR hatası:", error);
      alert("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsProcessing(false);
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
