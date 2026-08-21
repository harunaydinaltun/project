import { z } from "zod";
import { registerSchema } from "./AuthValidations.js";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Lütfen mevcut şifrenizi giriniz!"),
  newPassword: registerSchema.shape.password,
});
