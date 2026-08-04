import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/placeholders/logo_transparent.png";
import api from "../utils/api";

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "E-posta adresiniz doğrulanıyor, lütfen bekleyin...",
  );

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyToken = async () => {
      try {
        const res = await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage(res.data.message);

        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.error || "Doğrulama işlemi başarısız oldu.",
        );
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 w-full max-w-sm justify-center items-center bg-slate-50 rounded-2xl shadow-2xl gap-y-4 p-8 text-center">
        <img
          className="max-w-48 place-self-center mb-2"
          src={logo}
          alt="Logo"
        />

        <h2 className="text-xl font-bold text-slate-700">Hesap Doğrulama</h2>

        {status === "loading" && (
          <div className="text-slate-600 animate-pulse">{message}</div>
        )}

        {status === "success" && (
          <div className="text-green-600 font-semibold">
            <p>{message}</p>
            <p className="text-xs text-slate-500 mt-2">
              Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600 font-semibold">
            <p>{message}</p>
            <Link
              to="/login"
              className="block mt-4 text-blue-500 hover:underline text-sm"
            >
              Giriş sayfasına dön
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
