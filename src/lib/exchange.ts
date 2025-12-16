export async function getExchangeRates() {
  try {
    // Ücretsiz API servisi (Gerçek projede kendi key'ini alabilirsin)
    const res = await fetch("https://open.er-api.com/v6/latest/TRY", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    // TRY bazlı oranları USD ve EUR'ya çeviriyoruz
    const usdToTry = 1 / data.rates.USD;
    const eurToTry = 1 / data.rates.EUR;
    const goldToTry = 2950; // Not: Altın için genelde özel API gerekir, buraya bir baz fiyat koyalım

    return { USD: usdToTry, EUR: eurToTry, GOLD: goldToTry };
  } catch (error) {
    console.error("Kur bilgisi çekilemedi:", error);
    return { USD: 34.5, EUR: 37.2, GOLD: 3000 }; // Hata durumunda yedek fiyatlar
  }
}
