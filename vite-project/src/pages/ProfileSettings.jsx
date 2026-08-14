import { TbLockPassword } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditPersonalInformation from "../components/profilecomponents/settings/EditPersonalInformation";
import ChangePassword from "../components/profilecomponents/settings/ChangePassword";
import { useAuth } from "../context/AuthContext";

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [step, setStep] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 px-4">
      {step === "" && (
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col justify-evenly items-center">
          <div className="w-full">
            <button
              className="flex gap-x-1 self-start bg-slate-50 border border-slate-200 rounded-2xl p-2 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer mb-6"
              onClick={() => navigate("/profile")}
            >
              <IoReturnUpBackOutline className="mt-1" />
              <span>Geri</span>
            </button>

            <div className="flex flex-col md:flex-row gap-5 mt-3 w-full">
              <div
                className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] w-full md:w-1/2"
                onClick={() => setStep("edit")}
              >
                <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
                  <FaUserEdit size={40} />
                </div>
                <span className="text-xl font-semibold text-slate-800 text-center mb-2">
                  İletişim Bilgilerini Düzenle
                </span>
                <span className="text-xs font-semibold text-slate-500 text-center">
                  İsim, Soyisim, Telefon Numarası
                </span>
              </div>
              <div
                className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] w-full md:w-1/2"
                onClick={() => setStep("changePassword")}
              >
                <div className="p-4 bg-white rounded-full shadow-sm text-slate-700 group-hover:scale-110 transition-transform duration-300 mb-4">
                  <TbLockPassword size={40} />
                </div>
                <span className="text-xl font-semibold text-slate-800 text-center">
                  Şifre Değiştir
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "edit" && (
        <EditPersonalInformation
          setStep={setStep}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}

      {step === "changePassword" && (
        <ChangePassword setStep={setStep} currentUser={currentUser} />
      )}
    </div>
  );
};

export default ProfileSettings;
