import { useNavigate } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";

export const CheckOutErrorModal = ({ checkOutError }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-y-5 ring ring-slate-300 shadow-xl">
        <RiErrorWarningLine size={40} className="text-red-600" />
        <span className="text-2xl">{checkOutError}</span>
        <div className="flex gap-4">
          <button
            className="bg-green-600 p-2 text-white rounded-md hover:bg-green-700 cursor-pointer active:scale-[0.99] duration-200"
            onClick={() => navigate("/")}
          >
            ← Ana Sayfaya Geri Dön
          </button>
          <button
            className="bg-blue-600 p-2 text-white rounded-md hover:bg-blue-700 cursor-pointer active:scale-[0.99] duration-200"
            onClick={() => navigate("/profile")}
          >
            Profilim 👤
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutErrorModal;
