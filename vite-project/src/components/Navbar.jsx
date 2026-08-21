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
    <header className="bg-linear-to-r from-cyan-700 via-cyan-600 to-cyan-700 shadow-md sticky top-0 z-40 px-4 py-2.5 flex justify-between items-center rounded-b-2xl border-b border-cyan-500/30">
      {isPopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Çıkış Yap
            </h3>
            <p className="text-sm text-slate-600 mb-6">{t.logOutMessage}</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="flex-1 bg-red-500 text-white font-medium py-2.5 px-4 rounded-xl hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow-sm"
                onClick={() => {
                  handleLogout();
                  setIsPopUpOpen(false);
                }}
              >
                {t.logout}
              </button>
              <button
                type="button"
                className="flex-1 bg-slate-100 text-slate-700 font-medium py-2.5 px-4 rounded-xl hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
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

      <div
        className="flex items-center cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <img
          className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
          src={logo}
          alt="logo"
        />
      </div>

      <div className="flex items-center gap-3">
        {!currentUser ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl text-sm backdrop-blur-sm border border-white/25 transition-all active:scale-95 cursor-pointer shadow-sm"
              onClick={() => navigate("/register")}
            >
              {t.register}
            </button>
            <button
              type="button"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-emerald-900/10"
              onClick={() => navigate("/login")}
            >
              {t.login}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-white/90 font-medium text-sm hidden sm:inline-block">
              {t.welcome},{" "}
              <span className="font-semibold text-white">
                {currentUser.name}
              </span>
            </span>
            {(currentUser.user_type === "admin" ||
              currentUser.user_type === "manager") && (
              <button
                type="button"
                className="bg-purple-800 hover:bg-purple-900 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-sm duration-200"
                onClick={() => navigate(`/${currentUser.user_type}`)}
              >
                PANEL
              </button>
            )}
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-sm duration-200"
              onClick={() => navigate("/profile")}
            >
              {t.myProfile}
            </button>
            <button
              type="button"
              className="bg-red-500/90 hover:bg-red-600 text-white font-medium px-3.5 py-2 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-sm duration-200"
              onClick={() => setIsPopUpOpen(true)}
            >
              {t.logout}
            </button>
          </div>
        )}

        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl border border-white/25 transition-all active:scale-95 cursor-pointer p-1.5 shadow-sm ml-1"
          onClick={() => {
            setLang(lang === "tr" ? "en" : "tr");
          }}
          title="Dil Değiştir / Change Language"
        >
          {lang === "tr" ? (
            <TR className="rounded-sm shadow-xs" />
          ) : (
            <GB className="rounded-sm shadow-xs" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
