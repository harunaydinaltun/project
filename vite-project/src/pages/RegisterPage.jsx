import { useNavigate } from "react-router-dom";
import logo from "../assets/placeholders/logo_transparent.png";

export const RegisterPage = ({ t }) => {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 justify-center items-center bg-slate-50 rounded-2xl shadow-2xl gap-y-2 p-5">
        <img className="max-w-60 place-self-center" src={logo} alt="" />

        <div className="flex justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold">
              {t.name}
            </span>
            <input
              className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              type="text"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold">
              {t.surname}
            </span>
            <input
              className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              type="text"
            />
          </div>
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          {t.yourBirthdate}
        </span>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="date"
          max={today}
        />

        <span className="text-xs text-slate-500 font-semibold">{t.email}</span>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="email"
          name=""
          id=""
        />
        <span className="text-xs text-slate-500 font-semibold">
          {t.password}
        </span>

        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="password"
        />

        <span className="text-xs text-slate-500 font-semibold">
          {t.confirmYourPassword}
        </span>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="password"
        />
        <button className="place-self-center bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-shadow-sm rounded-sm max-w-30 p-2.5 transition-all duration-300 active:scale-[0.98] ">
          {t.register}
        </button>
        <div className="text-[11px]">
          <span>{t.haveAccount} </span>
          <span
            className="text-blue-600 hover:cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            {t.loginPage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
