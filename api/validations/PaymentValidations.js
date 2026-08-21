import { z } from "zod";
import cardValidator from "card-validator";

export const checkoutSchema = z
  .object({
    car_id: z.coerce.number({ required_error: "Araç seçimi zorunludur" }),
    pickup_location_id: z.coerce.number().optional(),
    return_location_id: z.coerce.number().optional(),
    packet_id: z.coerce.number().optional(),
    totalPrice: z.coerce.number(),

    extras: z.array(z.any()).optional().nullable(),

    start_date: z
      .string({ required_error: "Başlangıç tarihi zorunludur" })
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Geçersiz başlangıç tarihi formatı",
      ),

    end_date: z
      .string({ required_error: "Bitiş tarihi zorunludur" })
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Geçersiz bitiş tarihi formatı",
      ),

    cardDetails: z.object({
      cardNumber: z
        .string({ required_error: "Kart numarası zorunludur" })
        .transform((val) => val.replace(/\s+/g, ""))
        .refine(
          (val) => cardValidator.number(val).isValid,
          "Geçersiz kart numarası",
        ),

      expireDate: z
        .string({ required_error: "Son kullanma tarihi zorunludur" })
        .refine(
          (val) => cardValidator.expirationDate(val).isValid,
          "Geçersiz son kullanma tarihi",
        ),

      cvv: z
        .string({ required_error: "CVV zorunludur" })
        .refine((val) => cardValidator.cvv(val).isValid, "Geçersiz cvv"),
    }),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "Bitiş tarihi, başlangıç tarihinden önce olamaz",
  });
