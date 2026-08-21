import { useState, useEffect } from "react";
import { CurrencyContext } from "./CurrencyContext";
import api from "../utils/api";

export const CurrencyContextProvider = ({ children }) => {
  const [exchangeRates, setExchangeRates] = useState({ USD: null, EUR: null });
  const [isRatesLoaded, setIsRatesLoaded] = useState(false);

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("app_currency") || "TRY";
  });

  useEffect(() => {
    localStorage.setItem("app_currency", currency);
  }, [currency]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await api.get("/rates");
        setExchangeRates({ USD: res.data.USD, EUR: res.data.EUR });
      } catch (error) {
        console.error("Kur bilgisi çekilemedi", error);
        setExchangeRates({ USD: 0.029, EUR: 0.027 });
      } finally {
        setIsRatesLoaded(true);
      }
    };
    fetchRates();
  }, []);

  const formatPrice = (priceInTRY) => {
    if (currency === "USD")
      return `$${(priceInTRY * exchangeRates.USD).toFixed(2)}`;
    if (currency === "EUR")
      return `€${(priceInTRY * exchangeRates.EUR).toFixed(2)}`;
    return `${priceInTRY}₺`;
  };

  if (!isRatesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <CurrencyContext.Provider
      value={{
        exchangeRates,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
