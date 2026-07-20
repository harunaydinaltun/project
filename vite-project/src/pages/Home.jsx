import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Home = ({ t }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Lütfen tarihleri girin");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/cars/search",
        {
          startDate,
          endDate,
        },
      );

      // Gelen sonuçları (Müsait arabaları) Results sayfasına yönlendirirken state olarak aktarıyoruz
      navigate("/results", {
        state: { cars: response.data.data, startDate, endDate },
      });
    } catch (error) {
      console.error("Arama yapılırken hata oluştu:", error);
      alert("Araçlar listelenirken bir hata meydana geldi.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-200">
          <p className="text-slate-800 text-lg leading-relaxed text-center">
            LJNAFS CAKSAK SANCLAS ASLCNVAL CKLASCN nkvlasvlnk ALVNLAS Cnlnalksvn
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 md:p-10 gap-5">
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
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
