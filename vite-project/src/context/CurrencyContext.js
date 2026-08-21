import { createContext, useContext } from "react";

export const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      "useCurrency must be used within a CurrencyContextProvider",
    );
  }

  return context;
};
