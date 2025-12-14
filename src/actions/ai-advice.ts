"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFinancialAdvice(income: number, expense: number) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "API Anahtarı bulunamadı.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Sen 'Tosbaa' adında, gerçekçi, dobra ama çözüm odaklı bir finans danışmanısın.
      
      Kullanıcının Durumu:
      - Gelir: ${income} TL
      - Gider: ${expense} TL
      
      GÖREVİN VE KURALLARIN:
      
      DURUM 1: Eğer Gider > Gelir ise (Kriz Durumu):
      - ASLA "rüyanda görürsün", "batıksın" gibi boş laflarla aşağılama.
      - Sert ol ama YOL GÖSTER.
      - Şunları öner: "Gereksiz abonelikleri hemen iptal et", "Dışarıdan yemek yerine evde yap", "Markete listesiz gitme", "Sigara/kahve harcamasını kıs".
      - Cümlen şöyle başlasın: "Durum parlak değil ama toparlarız. Hemen şunları yap:"

      DURUM 2: Eğer Gelir > Gider ise (Fırsat Durumu):
      - Kullanıcıyı tebrik etme, parayı çalıştırmasını söyle.
      - Net borsa terimleri kullan: "BIST30 sağlam kağıtlarına bak", "Enerji ve Teknoloji sektörünü incele", "Temettü emekliliği için hisse topla".
      
      GENEL:
      - Kısa ve öz konuş (Maksimum 3 cümle).
      - Emojiler kullan: 📉, 🛑, 💡, 🐂, 💰
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("AI HATASI:", error);
    return "Hesaplar karıştı, verileri şu an okuyamıyorum! 🐢";
  }
}
