import { z } from "zod";
import valid from "card-validator";

const isValidTCNO = (tcno) => {
  if (!tcno || tcno.length !== 11 || tcno[0] === "0") return false;

  let oddSum = 0,
    evenSum = 0,
    sum = 0;

  for (let i = 0; i <= 9; i++) {
    if (i !== 9) {
      i % 2 === 0
        ? (oddSum += Number(tcno[i] * 7))
        : (evenSum += Number(tcno[i]));
    }
    sum += Number(tcno[i]);
  }

  if (tcno[9] != (oddSum - evenSum) % 10) return false;
  if (sum % 10 != tcno[10]) return false;

  return true;
};

export const creditCardSchema = z.object({
  tcno: z
    .string()
    .length(11, "TCNO 11 haneli olmalıdır.")
    .refine((val) => val[0] !== "0", "TCNO 0 ile başlayamaz.")
    .refine((val) => isValidTCNO(val), "Geçersiz TCNO"),

  name: z
    .string()
    .min(2, "En az 2 karakter olmalıdır.")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Sadece harf giriniz."),

  surname: z
    .string()
    .min(2, "En az 2 karakter olmalıdır.")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Sadece harf giriniz."),

  phone: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine(
      (val) => /^(05|5)\d{9}$/.test(val),
      "Geçerli bir numara giriniz (Örn: 05XX...)",
    ),

  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => valid.number(val).isValid, "Geçersiz kart numarası"),

  expireDate: z
    .string()
    .min(5, "Geçersiz veya geçmiş tarih")
    .refine(
      (val) => valid.expirationDate(val).isValid,
      "Geçersiz veya geçmiş tarih",
    ),

  cardOwner: z
    .string()
    .min(2, "Kart üzerindeki isim zorunludur.")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Sadece harf giriniz."),
});
