import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "İsim Alanı Dolu Olmak Zorunda" })
    .max(45, { message: "İsim 45 Karakterden Daha Fazla Olamaz" })
    .refine((val) => !/[!-/]+/.test(val), {
      message: "İsim özel karakter içeremez.",
    })
    .transform((val) => {
      const trimmed = val.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }),
  surname: z
    .string()
    .min(1, { message: "Lütfen tüm alanları doldurun." })
    .max(45)
    .refine((val) => !/[!-/]+/.test(val), {
      message: "Soyisim özel karakter içeremez.",
    })
    .transform((val) => {
      const trimmed = val.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }),

  email: z.email({ message: "Geçerli bir e-posta adresi giriniz." }).max(255),

  password: z
    .string()
    .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
    .max(64)
    .regex(/[a-zçğıöşü]+/, { message: "Şifre küçük harf içermelidir." })
    .regex(/[A-ZÇĞİÖŞÜ]+/, { message: "Şifre büyük harf içermelidir." })
    .regex(/[0-9]+/, { message: "Şifre sayı içermelidir." })
    .regex(/[!-/]+/, { message: "Şifre özel karakter içermelidir." })
    .refine((val) => !/\s/.test(val), { message: "Şifre boşluk içeremez." }),

  tel_no: z
    .string()
    .length(11, { message: "Telefon numarası 11 haneli olmalıdır." })
    .startsWith("05", { message: "Telefon numarası 05 ile başlamalıdır." }),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Tarih YYYY-AA-GG formatında olmalıdır.",
    })
    .refine(
      (val) => {
        const birthDateObj = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
        ) {
          age--;
        }
        return age >= 18;
      },
      { message: "En az 18 yaşında olmalısınız." },
    ),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Eksik Bilgi" }),
  newPassword: registerSchema.shape.password,
});

export const forgotPasswordSchema = z.object({
  email: registerSchema.shape.email,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token Bulunamadı"),
});

export const adminRegisterSchema = z.object({
  name: registerSchema.shape.name,
  surname: registerSchema.shape.surname,
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
  tel_no: registerSchema.shape.tel_no,
  birthdate: registerSchema.shape.birthdate,
});

export const managerRegisterSchema = z.object({
  name: registerSchema.shape.name,
  surname: registerSchema.shape.surname,
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
  tel_no: registerSchema.shape.tel_no,
  birthdate: registerSchema.shape.birthdate,
  location_id: z.coerce.number(),
  department: z.string().min(1, "Department boş olamaz").max(45),
  hire_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Tarih YYYY-AA-GG formatında olmalıdır.",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return (
          !isNaN(date.getTime()) && val === date.toISOString().split("T")[0]
        );
      },
      { message: "Geçersiz bir tarih girdiniz." },
    ),
});
