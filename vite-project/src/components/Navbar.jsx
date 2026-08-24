import { useState } from "react";
import { TR, GB } from "country-flag-icons/react/3x2";
import logo from "../assets/placeholders/logo_transparent.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CurrencySelector } from "./CurrencySelector";

export const Navbar = ({ t, setLang, lang }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-cyan-700 shadow-md sticky top-0 z-40 px-6 py-2.5 flex justify-between items-center transition-all">
      {isPopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Çıkış Yap</h3>
            <p className="text-sm text-slate-600 mb-8">{t.logOutMessage}</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-red-600 active:scale-95 transition-all"
                onClick={() => {
                  handleLogout();
                  setIsPopUpOpen(false);
                }}
              >
                {t.logout}
              </button>
              <button
                type="button"
                className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                onClick={() => setIsPopUpOpen(false)}
              >
                {t.return}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex items-center cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <img
          className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-105"
          src={logo}
          alt="logo"
        />
      </div>

      <div className="flex items-center">
        {!currentUser ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-white/90 hover:text-white font-medium px-4 py-2 text-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              {t.register}
            </button>
            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2 rounded-full text-sm transition-all active:scale-95 cursor-pointer border border-white/20"
              onClick={() => navigate("/login")}
            >
              {t.login}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-medium text-sm hidden md:block mr-2">
              {t.welcome},{" "}
              <span className="text-white font-semibold">
                {currentUser.name}
              </span>
            </span>

            {(currentUser.user_type === "admin" ||
              currentUser.user_type === "manager") && (
              <button
                type="button"
                className="text-white/90 hover:text-white font-medium px-4 py-1.5 rounded-full  transition-all active:scale-95 cursor-pointer border border-white/20"
                onClick={() => navigate(`/${currentUser.user_type}`)}
              >
                PANEL
              </button>
            )}

            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer border border-white/20"
              onClick={() => navigate("/profile")}
            >
              {t.myProfile}
            </button>

            <button
              type="button"
              className="bg-red-500/80 hover:bg-red-400/80 text-white font-medium px-4 py-1.5 rounded-full t transition-all active:scale-95 cursor-pointer border border-white/20"
              onClick={() => setIsPopUpOpen(true)}
            >
              {t.logout}
            </button>
          </div>
        )}

        <div className="w-px h-6 bg-white/20 mx-4 sm:mx-6"></div>

        <div className="flex items-center gap-2">
          <CurrencySelector />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer hover:bg-white/10 rounded-full"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            title="Dil Değiştir"
          >
            {lang === "tr" ? (
              <TR className="w-5 rounded-xs" />
            ) : (
              <GB className="w-5 rounded-xs" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
