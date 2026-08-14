import { useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import { CustomInput } from "../../CustomInput"; // Yolunuzu kendi proje yapınıza göre güncelleyin
import { PasswordConditions } from "../../PasswordConditions"; // Yolunuzu kendi proje yapınıza göre güncelleyin
import api from "../../../utils/api";

export const ChangePassword = ({ setStep, t = {} }) => {
  const [inputs, setInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [err, setErr] = useState(null);

  const [passwordConditions, setPasswordConditions] = useState({
    lowerCase: false,
    upperCase: false,
    number: false,
    length: false,
    special: false,
    noSpaces: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      setPasswordConditions({
        length: value.length >= 6,
        lowerCase: /[a-zçğıöşü]+/.test(value),
        upperCase: /[A-ZÇĞİÖŞÜ]+/.test(value),
        number: /[0-9]+/.test(value),
        special: /[!-/]+/.test(value),
        noSpaces: value.length > 0 && !/\s/.test(value),
      });

      if (
        value.length < 6 ||
        !/[a-zçğıöşü]+/.test(value) ||
        !/[A-ZÇĞİÖŞÜ]+/.test(value) ||
        !/[0-9]+/.test(value) ||
        !/[!-/]+/.test(value) ||
        /\s/.test(value)
      ) {
        setErrors((prev) => ({
          ...prev,
          newPassword:
            t.passwordConditionsError ||
            "Şifre güvenlik gereksinimlerini karşılamıyor",
        }));
      } else {
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      }
    }

    if (name === "newPassword" || name === "confirmPassword") {
      const passwordToCompare =
        name === "newPassword" ? value : inputs.newPassword;
      const confirmToCompare =
        name === "confirmPassword" ? value : inputs.confirmPassword;

      if (confirmToCompare && confirmToCompare !== passwordToCompare) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: t.passwordsDontMatch || "Şifreler eşleşmiyor",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    const hasValidationErrors = Object.values(errors).some(
      (error) => error !== "",
    );
    if (hasValidationErrors) {
      return setErr(t.fieldError || "Lütfen hatalı alanları düzeltin.");
    }

    const hasEmptyFields = Object.values(inputs).some((value) => value === "");
    if (hasEmptyFields) {
      return setErr(t.emptyFieldError || "Lütfen tüm alanları doldurun.");
    }

    try {
      await api.patch("/users/change-password", {
        currentPassword: inputs.currentPassword,
        newPassword: inputs.newPassword,
      });

      setInputs({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErr("Şifreniz başarıyla güncellendi!");
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      setErr(
        error.response?.data?.error || "Şifre güncellenirken bir hata oluştu.",
      );
    }
  };

  return (
    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col">
      <button
        className="flex gap-x-1 self-start bg-slate-50 border border-slate-200 rounded-2xl p-2 hover:bg-slate-100 hover:border-slate-300 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer mb-8"
        onClick={() => setStep("")}
      >
        <IoReturnUpBackOutline className="mt-1" />
        <span>Geri</span>
      </button>

      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center justify-center gap-3">
          <TbLockPassword className="text-slate-700" />
          Şifre Değiştir
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <CustomInput
            label="Mevcut Şifre"
            type="password"
            name="currentPassword"
            value={inputs.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            maxLength={64}
          />

          <div className="flex flex-col">
            <CustomInput
              label="Yeni Şifre"
              type="password"
              name="newPassword"
              value={inputs.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              placeholder="••••••••"
              maxLength={64}
            />
            <PasswordConditions
              conditions={passwordConditions}
              errors={errors}
              t={t}
              errorKey="newPassword"
            />
          </div>

          <CustomInput
            label="Yeni Şifre (Tekrar)"
            type="password"
            name="confirmPassword"
            value={inputs.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            maxLength={64}
          />

          {err && (
            <p className="text-sm text-red-600 text-center font-semibold mt-2">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 transition-colors mt-4"
          >
            Şifreyi Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
