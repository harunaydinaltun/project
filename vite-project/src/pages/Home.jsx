import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/placeholders/logo_transparent.png";
import { TR, GB } from "country-flag-icons/react/3x2";

export const Home = ({ t }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("tarihleri seçin");
      return;
    }

    if (endDate < startDate) {
      alert("bitiş başlangıçtan önce olamaz");
      return;
    }

    navigate("/results", { state: { startDate, endDate, totalDays } });
  };

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInTime = end.getTime() - start.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 0) return 0;

    return diffInDays;
  };

  const totalDays = calculateTotalDays(startDate, endDate);
  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4">
      <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex-1 flex-col bg-slate-50 flex items-center justify-center p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-200">
          <img
            className="max-w-full h-auto object-cover"
            src={logo}
            alt="logo"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 md:p-10 gap-5">
          <div className="w-11 flex self-end gap-x-1">
            <TR></TR>
            <GB></GB>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <h2 className="text-slate-800 text-2xl font-semibold mb-2">
              {t.searchCar || "Araç Ara"}
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500">
                {t.recieveDate || "Alış Tarihi"}
              </label>
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500">
                {t.deliveryDate || "İade Tarihi"}
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-all text-base mt-2"
            >
              {t.search || "Ara"}
            </button>
          </form>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium p-3 rounded-lg transition-all text-base -mt-1"
          >
            {t.register}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
