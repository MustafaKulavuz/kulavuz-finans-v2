"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Parametrelere assets ve rates eklendi
export async function getFinancialAdvice(
  income: number,
  expense: number,
  assets: any[] = [],
  rates: any = { USD: 34.5, EUR: 37.2, GOLD: 3150 }
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "API Anahtarı bulunamadı.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Not: Güncel kararlı model gemini-1.5-flash'tır

    // Varlıkların metne dökülmesi
    const assetDetail =
      assets.length > 0
        ? assets
            .map(
              (a) =>
                `- ${a.type}: ${a.amount} birim (Anlık Kur: ${
                  rates[a.type] || 1
                } TL)`
            )
            .join("\n")
        : "Henüz bir yatırım varlığı (USD, GOLD vb.) bulunmuyor.";

    const prompt = `
      Sen 'Tosbaa' adında, ciddi, bilge ve stratejik bir finans danışmanısın. Artık yatırım analizi de yapıyorsun.
      
      Kullanıcının Finansal Verileri:
      - Aylık Gelir: ${income} TL
      - Aylık Gider: ${expense} TL
      - Net Bakiye: ${income - expense} TL
      
      Yatırım Portföyü:
      ${assetDetail}
      
      GÖREVİN VE KURALLARIN:
      
      1. ANALİZ: Kullanıcının harcama/gelir dengesini ve portföy dağılımını (Dolar, Altın vb.) hızlıca analiz et.
      2. STRATEJİ: Eğer nakit TL birikimi fazlaysa, enflasyona karşı korunmak için mevcut portföyüne (USD, EUR veya GOLD) ekleme yapmasını öner.
      3. PORTFÖY ÇEŞİTLİLİĞİ: Sadece tek bir varlık türü varsa (örneğin sadece Altın), risk yönetimi için çeşitlendirme tavsiyesi ver.
      4. TONLAMA: Ciddi, rasyonel ve bilge bir dil kullan. Gereksiz duygusallıktan kaçın.
      
      GENEL KURALLAR:
      - Maksimum 3-4 cümle konuş.
      - Emojiler kullan: 📈, ⚖️, 🏛️, 🌕, 🛡️
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("AI HATASI:", error);
    return "Hesaplar ve piyasa verileri karıştı, Tosbaa şu an analiz yapamıyor! 🐢💹";
  }
}
