import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/placeholders/logo_transparent.png";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export const LoginPage = ({ t }) => {
  const location = useLocation();
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
      const res = await api.post("/auth/login", inputs);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (location.state) {
        const { car, startDate, endDate, pickUpLocation, dropOffLocation } =
          location.state;

        const queryParams = new URLSearchParams();

        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);
        if (pickUpLocation)
          queryParams.append("pickUpLocation", pickUpLocation);
        if (dropOffLocation)
          queryParams.append("dropOffLocation", dropOffLocation);

        navigate(`/cars/${car.car_id || car.id}?${queryParams.toString()}`, {
          replace: true,
          state: { car, startDate, endDate, pickUpLocation, dropOffLocation },
        });
      } else {
        navigate("/");
      }

      setTimeout(() => {
        login(res.data.user);
      }, 50);
    } catch (error) {
      console.log(error.message);
      setErr(t.error);
    }
  };

  return (
    <div className="h-lvh flex justify-center items-center">
      <div className="grid grid-cols-1 justify-center items-center min-h-2/3 min-w-1/3 bg-white rounded-2xl shadow-2xl gap-y-2 p-5">
        <img
          className="max-w-60 h-auto object-cover place-self-center"
          src={logo}
          alt=""
        />
        <span className=" text-xs text-slate-500 font-semibold">
          {t.username}
        </span>
        <input
          className="border rounded-sm p-1 pl-2"
          type="text"
          name="username"
          onChange={handleChange}
        />
        <span className="text-xs text-slate-500 font-semibold">
          {t.password}
        </span>

        <input
          className="border rounded-sm p-1 pl-2"
          type="password"
          name="password"
          onChange={handleChange}
        />
        {err && <p className="text-red-500 text-xs text-center">{err}</p>}
        <p
          className="justify-self-end text-[10px] text-blue-600 hover:cursor-pointer hover:underline"
          onClick={() => {
            navigate("/forgot-password");
          }}
        >
          {t.forgotYourPassword}
        </p>
        <button
          className="place-self-center bg-green-500 hover:cursor-pointer text-shadow-sm rounded-sm max-w-30 p-2 transition-all duration-300 active:scale-[0.99]"
          onClick={handleLogin}
        >
          {t.login}
        </button>
        <div className="text-[11px]">
          <span>{t.dontHaveAccount} </span>
          <span
            className="text-blue-600 hover:cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            {t.registerPage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
