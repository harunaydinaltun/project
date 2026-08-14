import { AiTwotoneProfile } from "react-icons/ai";
import { MdOutlineCarRental } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const initial = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 px-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-md">
            {initial}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center">
            Hoş Geldiniz, {currentUser?.name}
          </h1>
          <p className="text-slate-500 mt-2 text-center">
            Hesap ayarlarınızı ve kiralama geçmişinizi buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div
            className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
            onClick={() => navigate("rentals")}
          >
            <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
              <MdOutlineCarRental size={40} />
            </div>
            <span className="text-xl font-semibold text-slate-800 text-center">
              Rezervasyonlarım
            </span>
            <span className="text-sm text-slate-500 mt-2 text-center">
              Geçmiş ve aktif kiralamalarınızı görüntüleyin
            </span>
          </div>

          <div
            className="group flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
            onClick={() => navigate("settings")}
          >
            <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
              <AiTwotoneProfile size={40} />
            </div>
            <span className="text-xl font-semibold text-slate-800 text-center">
              Kişisel Bilgiler
            </span>
            <span className="text-sm text-slate-500 mt-2 text-center">
              Hesap detaylarınızı ve bilgilerinizi güncelleyin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
