import { useNavigate } from "react-router-dom";

export const Confirm = ({ rentalId }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-slate-50 justify-center items-center gap-y-2 p-3">
      <h1 className="text-2xl">Rezervasyonunuz başarı ile oluşturuldu!</h1>
      <span className="text-xl font-bold">Rezervasyon kodunuz: {rentalId}</span>
      <button
        className="bg-green-600 text-white text-shadow-2xs p-1 rounded-md ring ring-green-500 hover:bg-green-700 duration-300 cursor-pointer active:scale-[0.99]"
        onClick={() => navigate("/profile")}
      >
        Profilim
      </button>
    </div>
  );
};

export default Confirm;
