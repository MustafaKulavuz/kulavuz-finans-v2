"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFinancialAdvice(income: number, expense: number) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "API Anahtarı bulunamadı.";

    const genAI = new GoogleGenerativeAI(apiKey);

    // İŞTE ÇÖZÜM: Listende görünen en yeni modeli kullanıyoruz!
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Sen 'Tosbaa' adında samimi bir finans asistanısın.
      Gelir: ${income} TL, Gider: ${expense} TL.
      
      Kullanıcıya durumuna göre 1-2 cümlelik, motive edici, hafif komik ve bol emojili bir tavsiye ver.
      (Eğer gider gelirden fazlaysa nazikçe uyar, azsa tebrik et).
      Cevabın sadece Türkçe olsun.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("AI HATASI:", error);
    return "Şu an bağlantıda ufak bir sorun var ama bence harika gidiyorsun! 🐢";
  }
}
