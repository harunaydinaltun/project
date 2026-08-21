import cron from "node-cron";

let cachedRates = { USD: 0.029, EUR: 0.027 };

export const fetchExchangeRates = async () => {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/TRY");
    const data = await response.json();

    cachedRates = {
      USD: data.rates.USD,
      EUR: data.rates.EUR,
    };

    console.log("Döviz kurları başarıyla güncellendi:", cachedRates);
  } catch (error) {
    console.error(
      "Döviz kurları çekilirken hata oluştu, eski kurlar korunuyor.",
      error,
    );
  }
};

cron.schedule("0 0 * * *", fetchExchangeRates);

export const getCachedRates = () => {
  return cachedRates;
};
