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
    <div>
      <div>
        <span>Username</span>
        <input type="text" name="username" onChange={handleChange} />
        <span>Password</span>
        <input type="text" name="password" onChange={handleChange} />
        <button onClick={handleLogin}>Giriş Yap</button>
        {err && <span>{err}</span>}
      </div>
    </div>
  );
};

export default AdminLoginPage;
