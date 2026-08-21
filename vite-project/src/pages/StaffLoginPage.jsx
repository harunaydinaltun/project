import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { CustomInput } from "../components/CustomInput";
import { CiLock } from "react-icons/ci";

export const StaffLoginPage = ({ t }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/staff-login", inputs);

      localStorage.setItem("token", res.data.token);
      login(res.data.user);
      navigate(`/${res.data.user.user_type}`);
    } catch (error) {
      console.log(error.message);
      setErr(t.error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col w-full max-w-md p-8 md:p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CiLock size={35} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Sistem Girişi</h2>
          <p className="text-slate-500 text-sm mt-2">
            Lütfen yetkili hesap bilgilerinizi giriniz.
          </p>
        </div>
        <form className="flex flex-col w-full gap-5" onSubmit={handleLogin}>
          <CustomInput
            type="text"
            name="email"
            onChange={handleChange}
            label={"E-Posta"}
          />

          <CustomInput
            type="password"
            name="password"
            onChange={handleChange}
            label={"Şifre"}
          />
          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98] active:shadow-sm"
          >
            {t.login}
          </button>
          {err && (
            <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
              <span className="text-red-600 text-sm font-medium">{err}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StaffLoginPage;
