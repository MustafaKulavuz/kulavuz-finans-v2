// src/services/ai-service.ts (Ücretsiz ve Kotasız Mod)

export async function analyzeFinanceText(text: string) {
  // Metindeki ilk sayıyı bulur (Miktar)
  const amountMatch = text.match(/\d+/);
  const amount = amountMatch ? parseInt(amountMatch[0]) : 0;

  let category = "Genel";
  let type = "EXPENSE";
  const lowerText = text.toLowerCase();

  // Basit kelime eşleştirme ile kategori tahmini
  if (
    lowerText.includes("yemek") ||
    lowerText.includes("mutfak") ||
    lowerText.includes("market")
  ) {
    category = "Gıda";
  } else if (
    lowerText.includes("kira") ||
    lowerText.includes("fatura") ||
    lowerText.includes("ev")
  ) {
    category = "Ev Gideri";
  } else if (lowerText.includes("maaş") || lowerText.includes("gelir")) {
    category = "Gelir";
    type = "INCOME";
  } else if (
    lowerText.includes("yol") ||
    lowerText.includes("benzin") ||
    lowerText.includes("otobüs")
  ) {
    category = "Ulaşım";
  }

  return {
    amount,
    description: text,
    category,
    type,
  };
}
