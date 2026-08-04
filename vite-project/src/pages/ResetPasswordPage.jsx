import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/placeholders/logo_transparent.png";
import { CustomInput } from "../components/CustomInput";
import { PasswordConditions } from "../components/PasswordConditions";
import api from "../utils/api";

export const ResetPasswordPage = ({ t }) => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    lowerCase: false,
    upperCase: false,
    number: false,
    special: false,
    noSpaces: false,
  });
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const isValidLength = value.length >= 6;
    const hasLowerCase = /[a-zçğıöşü]+/.test(value);
    const hasUpperCase = /[A-ZÇĞİÖŞÜ]+/.test(value);
    const hasNumber = /[0-9]+/.test(value);
    const hasSpecial = /[!-/]+/.test(value);
    const hasNoSpaces = value.length > 0 && !/\s/.test(value);

    setPasswordConditions({
      length: isValidLength,
      lowerCase: hasLowerCase,
      upperCase: hasUpperCase,
      number: hasNumber,
      special: hasSpecial,
      noSpaces: hasNoSpaces,
    });

    const isAllValid =
      isValidLength &&
      hasLowerCase &&
      hasUpperCase &&
      hasNumber &&
      hasSpecial &&
      hasNoSpaces;
    setPasswordError(!isAllValid ? "Şifre gereksinimleri karşılamıyor" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (passwordError) return setError("Lütfen geçerli bir şifre belirleyin.");
    if (password !== confirmPassword) return setError("Şifreler eşleşmiyor.");

    try {
      const res = await api.post("/auth/reset_password", {
        token,
        newPassword: password,
      });
      setMessage(res.data.message);

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Şifre sıfırlanırken hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 w-full max-w-sm justify-center items-center bg-slate-50 rounded-2xl shadow-2xl gap-y-3 p-6"
      >
        <img
          className="max-w-48 place-self-center mb-2"
          src={logo}
          alt="Logo"
        />

        <h2 className="text-lg font-bold text-slate-700 text-center mb-2">
          Yeni Şifre Belirle
        </h2>

        <div className="flex flex-col">
          <CustomInput
            label="Yeni Şifre"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <PasswordConditions
            conditions={passwordConditions}
            errors={{ password: passwordError }}
            t={t}
          />
        </div>

        <CustomInput
          label="Yeni Şifreyi Onayla"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="place-self-center bg-blue-500 text-slate-200 ring-1 ring-blue-400 shadow-xs rounded-sm w-full mt-2 p-2 transition-all duration-75 hover:scale-[0.99]"
        >
          Şifreyi Güncelle
        </button>

        {message && (
          <p className="text-sm text-green-600 text-center font-semibold">
            {message} Yönlendiriliyorsunuz...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 text-center font-semibold">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
