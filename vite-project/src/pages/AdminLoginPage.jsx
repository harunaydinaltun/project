import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export const AdminLoginPage = ({ t }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/admin-login", inputs);

      localStorage.setItem("token", res.data.token);

      login(res.data.admin);
      navigate("/admin");
    } catch (error) {
      console.log(error.message);
      setErr(t.error);
    }
  };

  return (
    <div className="min-h-lvh flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl grid grid-cols-1 min-h-80 min-w-70 justify-center items-center  p-5 border ">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-semibold">
            {t.username}
          </span>
          <input
            className="border rounded-sm p-1 pl-2"
            type="text"
            name="username"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-semibold">
            {t.password}
          </span>
          <input
            className="border rounded-sm p-1 pl-2"
            type="password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 cursor-pointer hover:shadow-md duration-200 active:scale-[0.99] active:shadow-sm"
        >
          {t.login}
        </button>
        {err && <span className="text-red-500">{err}</span>}
      </div>
    </div>
  );
};

export default AdminLoginPage;
