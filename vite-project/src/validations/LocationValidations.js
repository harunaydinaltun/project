import { z } from "zod";

export const locationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "İsim alanı çok kısa" })
    .max(45, "İsim alanı çok uzun"),
  full_address: z.string().min(10, { message: "Adres alanı çok kısa" }),
  city: z
    .string()
    .min(3, { message: "Şehir alanı çok kısa" })
    .max(45, { message: "Şehir alanı çok uzun" }),
  branch_manager_id: z.coerce.number(),
});
