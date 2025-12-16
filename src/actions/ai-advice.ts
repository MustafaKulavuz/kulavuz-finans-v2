"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Tosbaa Yatırım Danışmanı Fonksiyonu
 * Kullanıcının gelir, gider ve varlık verilerini analiz ederek strateji sunar.
 */
export async function getFinancialAdvice(
  income: number,
  expense: number,
  assets: any[] = [],
  rates: any = { USD: 34.5, EUR: 37.2, GOLD: 3150 }
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return "API Anahtarı bulunamadı. Lütfen sistem yöneticisine başvurun.";

    const genAI = new GoogleGenerativeAI(apiKey);
    // En kararlı ve hızlı model sürümü kullanılıyor
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Varlıkların metne dökülmesi ve güvenli veri kontrolü
    const assetDetail =
      assets && assets.length > 0
        ? assets
            .map(
              (a) =>
                `- ${a.type}: ${a.amount} birim (Anlık Kur: ${
                  rates[a.type] || "Veri Alınamadı"
                } TL)`
            )
            .join("\n")
        : "Henüz bir yatırım varlığı (USD, GOLD vb.) bulunmuyor.";

    const prompt = `
      Sen 'Tosbaa' adında, ciddi, bilge ve stratejik bir finans danışmanısın. Yatırım analizi konusunda uzmansın.
      
      Kullanıcının Finansal Verileri:
      - Aylık Gelir: ${income} TL
      - Aylık Gider: ${expense} TL
      - Aylık Net Kalan: ${income - expense} TL
      
      Mevcut Yatırım Portföyü:
      ${assetDetail}
      
      GÖREVİN VE ANALİZ KURALLARIN:
      1. RİSK ANALİZİ: Kullanıcının harcama/gelir dengesini ve portföy dağılımını (Dolar, Altın vb.) nesnel olarak değerlendir.
      2. YATIRIM STRATEJİSİ: Eğer net bakiye artıdaysa, bu nakit TL'yi enflasyona karşı korumak için hangi varlığa (USD, EUR veya GOLD) yönlendirmesi gerektiğini teknik bir dille öner.
      3. ÇEŞİTLENDİRME: Portföy tek bir varlığa yığılmışsa, risk yayımı (diversification) tavsiyesi ver.
      4. KİŞİLİK: Bilge, rasyonel, kısa konuşan ve strateji odaklı bir kaplumbağa gibi davran.
      
      GENEL KURALLAR:
      - Maksimum 3-4 cümle ile net konuş.
      - Emojilerle zenginleştir: 📈, ⚖️, 🏛️, 🛡️, 💹
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return (
      responseText ||
      "Şu an net bir tavsiye oluşturamadım, piyasaları izlemeye devam et! 🐢"
    );
  } catch (error: any) {
    console.error("TOSBAA AI HATASI:", error);
    // Hata durumunda kullanıcıya gösterilecek dostane mesaj
    return "Hesaplar ve piyasa verileri karıştı, Tosbaa şu an analiz yapamıyor! 🐢💹";
  }
}
