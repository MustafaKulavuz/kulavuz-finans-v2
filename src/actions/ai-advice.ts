"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFinancialAdvice(income: number, expense: number) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "API Anahtarı bulunamadı.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Sen 'Tosbaa' adında, kurt bir borsacı ve acımasız bir finans danışmanısın.
      
      Kullanıcının Durumu:
      - Gelir: ${income} TL
      - Gider: ${expense} TL
      
      GÖREVİN VE KURALLARIN:
      1. Asla yumuşak konuşma. Dobra ol.
      2. Eğer Gider > Gelir ise: "Hisse senedini rüyanda görürsün", "Önce borcunu kapa batık!" gibi sert çıkış.
      3. Eğer Gelir > Gider ise:
         - Sadece "yatırım yap" deme. SPESİFİK OL.
         - Şunlardan bahset: "BIST30'un sağlam kağıtlarına gir", "Yenilenebilir enerji hisselerini topla", "Temettü veren baba şirketlere ortak ol", "Teknoloji hisselerinde fırsat var".
         - Borsacı ağzıyla konuş (Lot, Portföy, Ralli, Boğa piyasası gibi terimler kullan).
      4. Cevabın 2-3 cümleyi geçmesin.
      5. Emojiler: 📈, 🐂, 📉, 💸, 🏢
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("AI HATASI:", error);
    return "Piyasa kapalı, verilere ulaşamıyorum! 📉";
  }
}
