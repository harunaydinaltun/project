import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/placeholders/logo_transparent.png";
import { TR, GB } from "country-flag-icons/react/3x2";
import RentalDatePicker from "../components/RentalDatePicker";

export const Home = ({ t, setLang, lang }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const now = new Date();

  let roundedHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();

  if (roundedHour >= 24) roundedHour = 23;

  const defaultHourStr = `${roundedHour.toString().padStart(2, "0")}:00`;

  const defaultPickUpDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];

  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 2);
  const defaultDropOffDate = new Date(
    futureDate.getTime() - futureDate.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];
  const [pickUpDate, setPickUpDate] = useState(defaultPickUpDate);
  const [pickUpTime, setPickUpTime] = useState(defaultHourStr);

  const [dropOffDate, setDropOffDate] = useState(defaultDropOffDate);
  const [dropOffTime, setDropOffTime] = useState(defaultHourStr);

  const [pickUpLocation, setPickUpLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!pickUpDate || !dropOffDate) {
      alert("Lütfen tarihleri seçin");
      return;
    }

    if (!pickUpLocation || !dropOffLocation) {
      alert("Lütfen alış ve teslim şubelerini seçin.");
      return;
    }

    const startDate = `${pickUpDate}T${pickUpTime}`;
    const endDate = `${dropOffDate}T${dropOffTime}`;

    if (new Date(startDate) >= new Date(endDate)) {
      alert("Bitiş tarihi başlangıç tarihinden önce olamaz");
      return;
    }

    const totalDays = calculateTotalDays(startDate, endDate);
    navigate("/results", {
      state: { startDate, endDate, totalDays, pickUpLocation, dropOffLocation },
    });
  };

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInTime = end.getTime() - start.getTime();

    const diffInHours = diffInTime / (1000 * 60 * 60);
    const diffInDays = Math.ceil(diffInHours / 24);

    if (diffInDays < 0) return 0;

    return diffInDays;
  };

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
            <TR
              className={`hover:cursor-pointer transition-all duration-100 ${lang === "tr" ? "scale-[1.1]" : "opacity-50 "}`}
              onClick={() => {
                setLang("tr");
              }}
            ></TR>
            <GB
              className={`hover:cursor-pointer transition-all duration-100 ${lang === "en" ? "scale-[1.1]" : "opacity-50"}`}
              onClick={() => {
                setLang("en");
              }}
            ></GB>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            {currentUser ? (
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-green-600">
                  {t.welcome}, {currentUser.name}
                </span>
                <button
                  className=" rounded-lg p-1 text-shadow-lg bg-slate-100 text-[13px] cursor-pointer hover:bg-slate-200 hover:scale-[0.99] transition-all duration-300"
                  type="button"
                  onClick={() => navigate("/profile")}
                >
                  👤{t.myProfile}
                </button>
              </div>
            ) : (
              ""
            )}
            <h2 className="text-slate-800 text-shadow-xs text-2xl font-semibold mb-2">
              {t.searchCar || "Araç Ara"}
            </h2>

            <RentalDatePicker
              t={t}
              pickUpDate={pickUpDate}
              setPickUpDate={setPickUpDate}
              pickUpTime={pickUpTime}
              setPickUpTime={setPickUpTime}
              dropOffDate={dropOffDate}
              setDropOffDate={setDropOffDate}
              dropOffTime={dropOffTime}
              setDropOffTime={setDropOffTime}
              pickUpLocation={pickUpLocation}
              setPickUpLocation={setPickUpLocation}
              dropOffLocation={dropOffLocation}
              setDropOffLocation={setDropOffLocation}
            ></RentalDatePicker>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-shadow-xs font-medium p-3 rounded-lg transition-all text-base mt-2 hover:cursor-pointer hover:scale-[0.99]"
            >
              {t.search}
            </button>
          </form>

          {!currentUser ? (
            <div className="flex gap-1">
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-shadow-xs font-medium p-3 rounded-lg transition-all text-base -mt-1 hover:cursor-pointer hover:scale-[0.98]"
              >
                {t.register}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-shadow-xs font-medium p-3 rounded-lg transition-all text-base -mt-1 hover:cursor-pointer hover:scale-[0.98]"
              >
                {t.login}
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
