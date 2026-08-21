import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import ManagerSidebar from "../components/managerpanelcomponents/ManagerSidebar";
import AdminShowBranchesDetails from "../components/panelcomponents/AdminShowBranchDetails";
import ManagerShowConfirmedRentals from "../components/managerpanelcomponents/ManagerShowConfirmedRentals";
import ManagerShowAllRentals from "../components/managerpanelcomponents/ManagerShowAllRentals";
import ManagerShowActiveRentals from "../components/managerpanelcomponents/ManagerShowActiveRentals";

export const ManagerPanel = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("welcome");
  return (
    <div className="flex min-w-full min-h-screen">
      <ManagerSidebar setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col items-center">
        {activeTab === "welcome" && (
          <div className="min-h-screen flex justify-center items-start pt-20 px-4">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col items-center">
              <div className="flex flex-col items-center mb-10 gap-y-5">
                <span className="text-2xl font-bold text-slate-800 text-center">
                  Hoş Geldiniz Sayın, {currentUser.name}
                </span>
                <span className="text-xl font-semibold text-slate-800 text-center">
                  Burası şube ve filo bilgilerini düzenleyebileceğiniz bir
                  paneldir. Lütfen soldaki menüyü kullanınız.
                </span>

                <div
                  className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                  onClick={() => navigate("/profile")}
                >
                  <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
                    <CgProfile size={40} />
                  </div>
                  <span className="text-xl font-semibold text-slate-800 text-center">
                    Profilim
                  </span>
                </div>
                <span className="text-md font-semibold text-slate-500 text-center">
                  Profil bilgilerinizi düzenlemek istiyorsanız yukarıdaki
                  butondan profilinize erişebilirsiniz.
                </span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "fleet" && (
          <AdminShowBranchesDetails
            selectedBranchId={currentUser.location_id}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "confirmedres" && (
          <ManagerShowConfirmedRentals locId={currentUser.location_id} />
        )}
        {activeTab === "allres" && (
          <ManagerShowAllRentals locId={currentUser.location_id} />
        )}
        {activeTab === "activeres" && (
          <ManagerShowActiveRentals locId={currentUser.location_id} />
        )}
      </div>
    </div>
  );
};

export default ManagerPanel;
