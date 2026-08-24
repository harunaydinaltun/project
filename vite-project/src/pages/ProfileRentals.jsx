import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { ConfirmedRentals } from "../components/profilecomponents/rentals/ConfirmedRentals";
import { ActiveRentals } from "../components/profilecomponents/rentals/ActiveRentals";
import { FinishedRentals } from "../components/profilecomponents/rentals/FinishedRentals";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { GiConfirmed } from "react-icons/gi";
import { FaCarOn } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";

export const ProfileRentals = () => {
  const [confirmedRentals, setConfirmedRentals] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [finishedRentals, setFinishedRentals] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState("");

  useEffect(() => {
    api
      .get("/rentals/getById")
      .then((res) => {
        setConfirmedRentals(
          res.data.data.filter((r) => r.status === "confirmed"),
        );
        setActiveRentals(res.data.data.filter((r) => r.status === "active"));
        setFinishedRentals(
          res.data.data.filter(
            (r) => r.status === "completed" || r.status === "canceled",
          ),
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally();
  }, []);

  return (
    <div>
      {page === "" && (
        <div className="min-h-screen flex justify-center items-start pt-20 px-4 ">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col items-center ">
            <button
              className="flex gap-x-1 self-start bg-slate-50 border border-slate-200 rounded-2xl p-2 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <IoReturnUpBackOutline className="mt-1" />
              <span>Geri</span>
            </button>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div
                  className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                  onClick={() => setPage("confirmed")}
                >
                  <div className="p-4 bg-white rounded-full shadow-sm text-green-600 group-hover:scale-110 transition-transform duration-300 mb-4">
                    <GiConfirmed size={40} />
                  </div>

                  <span>Onaylanan Rezervasyonlar</span>
                </div>
                <div
                  className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                  onClick={() => setPage("active")}
                >
                  <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
                    <FaCarOn size={40} />
                  </div>
                  <span>Aktif Rezervasyonlar</span>
                </div>
              </div>

              <div
                className="self-center group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                onClick={() => setPage("finished")}
              >
                <div className="p-4 bg-white rounded-full shadow-sm text-slate-600 group-hover:scale-110 transition-transform duration-300 mb-4">
                  <MdHistory size={40} />
                </div>
                <span>Geçmiş Rezervasyonlar</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "confirmed" && (
        <ConfirmedRentals
          confirmedRentals={confirmedRentals}
          setPage={setPage}
        />
      )}
      {page === "active" && (
        <ActiveRentals activeRentals={activeRentals} setPage={setPage} />
      )}
      {page === "finished" && (
        <FinishedRentals finishedRentals={finishedRentals} setPage={setPage} />
      )}
    </div>
  );
};

export default ProfileRentals;
