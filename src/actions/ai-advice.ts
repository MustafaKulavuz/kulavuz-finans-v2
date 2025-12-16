"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFinancialAdvice(
  income: number = 0,
  expense: number = 0,
  assets: any[] = [],
  rates: any = {}
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "API Anahtarı bulunamadı.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Varlık verilerini güvenli hale getir
    // src/actions/ai-advice.ts

    // assetInfo kısmını bu şekilde güncelle:
    const assetInfo =
      Array.isArray(assets) && assets.length > 0
        ? assets
            .map((a) => `${a.type || "Varlık"}: ${a.amount || 0}`)
            .join(", ")
        : "Yatırım bulunmuyor";

    // console.log ekleyerek hatayı terminalden takip et:
    console.log("AI'ya giden veriler:", { income, expense, assetInfo });
    const prompt = `
      Sen finans danışmanı Tosbaa'sın. 
      Gelir: ${income} TL, Gider: ${expense} TL. 
      Varlıklar: ${assetInfo}. 
      Kurlar: USD=${rates?.USD || "Bilinmiyor"}, GOLD=${
      rates?.GOLD || "Bilinmiyor"
    }.
      
      Kısa ve öz (max 2 cümle), stratejik bir yatırım tavsiyesi ver. 📈
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Hatası Detayı:", error);
    return "Şu an teknik bir sorun var, sonra tekrar dene! 🐢";
  }
}
