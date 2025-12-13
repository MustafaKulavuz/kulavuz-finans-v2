import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "DİKKAT: OPENAI_API_KEY bulunamadı! .env dosyasını kontrol edin."
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key", // Hata fırlatmaması için
});
export async function analyzeFinanceText(text: string) {
  try {
    const prompt = `Analiz et: "${text}". JSON döndür: { "amount": number, "description": string, "category": string, "type": "EXPENSE" | "INCOME" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("AI Analiz Hatası:", error);
    // Hata durumunda varsayılan bir değer döndür ki uygulama çökmesin
    return {
      amount: 0,
      description: text,
      category: "Belirsiz",
      type: "EXPENSE",
    };
  }
}
