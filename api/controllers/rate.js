import { getCachedRates } from "../utils/exchangeRate.js";

export const getRates = async (req, res) => {
  const rates = getCachedRates();
  res.status(200).json(rates);
};
