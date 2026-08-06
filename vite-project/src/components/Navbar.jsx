import { useState } from "react";
import { TR, GB } from "country-flag-icons/react/3x2";
import logo from "../assets/placeholders/logo_transparent.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({ t, setLang, lang }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-linear-to-b from-cyan-600 to-cyan-700 flex justify-between min-h-10 rounded-b-lg ring-1 ring-cyan-600 shadow-2xs">
      {isPopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="flex flex-col bg-slate-50 w-fit h-fit rounded-2xl p-15">
            <span className="mb-10">{t.logOutMessage}</span>
            <div className="flex justify-evenly">
              <button
                className="bg-red-500 text-white p-2 rounded-lg ring-1 ring-slate-200 hover:cursor-pointer active:scale-[0.99]"
                onClick={() => {
                  handleLogout();
                  setIsPopUpOpen(false);
                }}
              >
                {t.logout}
              </button>
              <button
                className="bg-slate-100 p-2 rounded-lg ring-1 ring-slate-200 hover:cursor-pointer active:scale-[0.98]"
                onClick={() => {
                  setIsPopUpOpen(false);
                }}
              >
                {t.return}
              </button>
            </div>
          </div>
        </div>
      )}
      <img
        className="w-15 h-15 ml-2 hover:cursor-pointer"
        src={logo}
        alt="logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="flex gap-1 items-center">
        {!currentUser ? (
          <>
            <button
              className="bg-slate-100 shadow-lg text-slate-600 font-semibold h-2/3 rounded-sm text-sm text-shadow-xs ring-1 ring-slate-50 transition-all p-1 active:scale-[0.99] hover:cursor-pointer"
              onClick={() => navigate("/register")}
            >
              {t.register}
            </button>
            <button
              className="bg-green-500 shadow-lg text-white font-semibold h-2/3 rounded-sm text-sm text-shadow-xs ring-1 ring-green-500 transition-all p-1 active:scale-[0.99] hover:cursor-pointer"
              onClick={() => navigate("/login")}
            >
              {t.login}👤
            </button>
          </>
        ) : (
          <div className="flex gap-2 mr-2">
            <span className="text-white font-semibold text-sm self-center">
              {t.welcome}, {currentUser.username}
            </span>
            <button
              className="bg-blue-600 shadow-lg text-white font-semibold h-2/3 rounded-sm text-sm text-shadow-xs ring-1 ring-blue-500 hover:bg-blue-700 transition-all duration-300 p-1 active:scale-[0.98] hover:cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {t.myProfile}👤
            </button>
            <button
              className="bg-red-500 shadow-lg text-white font-semibold h-2/3 rounded-sm text-sm text-shadow-xs ring-1 ring-red-400 hover:bg-red-600 transition-all duration-300 p-1 active:scale-[0.98] hover:cursor-pointer"
              onClick={() => {
                setIsPopUpOpen(true);
              }}
            >
              {t.logout}
            </button>
          </div>
        )}

        <button
          className="h-2/3 w-8 hover:bg-cyan-600 rounded-xl transition-all duration-300 p-1 hover:cursor-pointer"
          onClick={() => {
            lang === "tr" ? setLang("en") : setLang("tr");
          }}
        >
          {lang === "tr" ? <TR /> : <GB />}
        </button>
      </div>
    </div>
  );
};
