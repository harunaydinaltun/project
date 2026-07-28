import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/placeholders/logo_transparent.png";
import { CustomInput } from "../components/CustomInput";

export const ForgotPasswordPage = ({ t }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/forgot-password",
        { email },
      );
      setMessage(res.data.message);
    } catch (err) {
      console.log(err.message);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 w-full max-w-sm justify-center items-center bg-slate-50 rounded-2xl shadow-2xl gap-y-4 p-6"
      >
        <img
          className="max-w-48 place-self-center mb-2"
          src={logo}
          alt="Logo"
        />

        <div className="text-center mb-2">
          <h2 className="text-lg font-bold text-slate-700">
            {t.forgotYoutPassword}
          </h2>
          <p className="text-xs text-slate-500">{t.passwordResetMessage}</p>
        </div>

        <CustomInput
          label="E-Posta Adresi"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="place-self-center bg-blue-500 text-slate-200 ring-1 ring-blue-400 shadow-xs rounded-sm w-full mt-2 p-2 transition-all duration-75 hover:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Gönderiliyor..." : "Bağlantı Gönder"}
        </button>

        {message && (
          <p className="text-sm text-green-600 text-center font-semibold">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 text-center font-semibold">
            {error}
          </p>
        )}

        <div className="text-[11px] text-center mt-2">
          <span
            className="text-blue-600 font-semibold hover:cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            {t.returnHomepage}
          </span>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
