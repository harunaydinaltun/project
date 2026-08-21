import { z } from "zod";

export const addModelSchema = z.object({
  brand: z
    .string()
    .min(1, "Marka Adı Zorunludur")
    .max(45)
    .transform((val) => {
      const trimmed = val.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }),
  modelName: z
    .string()
    .min(1, "Model Adı Zorunludur")
    .max(45)
    .transform((val) => {
      const trimmed = val.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }),
  year: z.coerce.number().min(1940).max(new Date().getFullYear()),
  trim: z.string().min(1).max(45),
  fuelType: z.string().min(1).max(45),
  gearType: z.string().min(1).max(45),
  bodyType: z.string().min(1).max(45),
  engineSize: z.string().min(1).max(45),
  doors: z.coerce.number().min(2).max(9),
  minAge: z.coerce.number().min(18),
});
