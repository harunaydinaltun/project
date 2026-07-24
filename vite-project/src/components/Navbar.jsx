import { TR, GB } from "country-flag-icons/react/3x2";
import logo from "../assets/placeholders/logo_transparent.png";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ t, setLang, lang }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-cyan-500 flex justify-between min-h-10 rounded-b-lg">
      <img
        className="w-15 h-15 ml-2 hover:cursor-pointer"
        src={logo}
        alt="logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="flex gap-1">
        <button
          className="bg-slate-200 h-2/3 rounded-b-sm text-sm text-shadow-xs hover:bg-slate-400 hover:text-white hover:cursor-pointer transition-all duration-300 p-1"
          onClick={() => {
            navigate("/register");
          }}
        >
          {t.register}
        </button>
        <button
          className="bg-green-500 h-2/3 rounded-b-sm text-sm text-shadow-xs hover:bg-green-700 hover:text-white hover:cursor-pointer transition-all duration-300 p-1"
          onClick={() => {
            navigate("/login");
          }}
        >
          {t.login}👤
        </button>
        <button
          className="h-2/3 w-8 hover:bg-cyan-600 rounded-xl transition-all duration-300 p-1"
          onClick={() => {
            lang === "tr" ? setLang("en") : setLang("tr");
          }}
        >
          {lang === "tr" ? <TR /> : <GB />}{" "}
        </button>
      </div>
    </div>
  );
};
