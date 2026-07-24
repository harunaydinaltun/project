import { useNavigate } from "react-router-dom";
import logo from "../assets/placeholders/logo_transparent.png";

export const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-lvh flex justify-center items-center">
      <div className="grid grid-cols-1 justify-center items-center min-h-2/3 min-w-1/3 bg-white rounded-2xl shadow-2xl gap-y-2 p-5">
        <img
          className="max-w-60 h-auto object-cover place-self-center"
          src={logo}
          alt=""
        />
        <span className="self- text-xs text-slate-500 font-semibold">
          Email
        </span>
        <input
          className="border rounded-sm p-1 pl-2"
          type="email"
          name=""
          id=""
        />
        <span className="text-xs text-slate-500 font-semibold">Password</span>

        <input className="border rounded-sm p-1 pl-2" type="password" />
        <p
          className="justify-self-end text-[10px] text-blue-600 hover:cursor-pointer hover:underline"
          onClick={() => {
            navigate("/psswrdrst");
          }}
        >
          Forgot your password?
        </p>
        <button className="place-self-center bg-green-500 hover:bg-green-700 hover:text-white hover:cursor-pointer text-shadow-sm rounded-sm max-w-30 p-2 transition-all duration-300">
          Giriş Yap
        </button>
        <div className="text-[11px]">
          <span>Don't you have an account? Go to </span>
          <span
            className="text-blue-600 hover:cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            register page.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
