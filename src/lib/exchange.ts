export async function getExchangeRates() {
  try {
    // API'ye istek gönderiyoruz
    const res = await fetch("https://open.er-api.com/v6/latest/TRY", {
      next: { revalidate: 3600 }, // Veriyi 1 saat önbelleğe al
    });

    if (!res.ok) throw new Error("API hatası");
    const data = await res.json();

    // TRY bazlı oranları USD ve EUR'ya çeviriyoruz
    const usdToTry = 1 / data.rates.USD;
    const eurToTry = 1 / data.rates.EUR;
    const goldToTry = 3150; // Altın genelde özel API ister, manuel baz fiyat ekledik

    return { USD: usdToTry, EUR: eurToTry, GOLD: goldToTry };
  } catch (error) {
    console.error("Kur çekilemedi, yedekler kullanılıyor:", error);
    return { USD: 34.5, EUR: 37.2, GOLD: 3000 }; // Hata anında uygulamanın çökmemesi için
  }
}
