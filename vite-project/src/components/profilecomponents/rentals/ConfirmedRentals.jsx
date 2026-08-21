import { useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

export const ConfirmedRentals = ({ confirmedRentals, setPage }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const handleOpenModal = (rentalId) => {
    setSelectedRentalId(rentalId);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRentalId) return;

    try {
      setIsCanceling(true);

      await api.patch("/rentals/cancelById", { rentalId: selectedRentalId });

      setIsModalOpen(false);
      navigate("/profile");

      alert("Rezervasyonunuz başarıyla iptal edildi.");
    } catch (error) {
      console.error("İptal işlemi başarısız:", error);
      alert(
        error.response?.data?.message ||
          "İptal işlemi sırasında bir hata oluştu.",
      );
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 px-4 relative">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-6 md:p-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <button
            className="flex items-center gap-x-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-300 active:scale-[0.98] cursor-pointer text-slate-600 font-medium"
            onClick={() => setPage("")}
          >
            <IoReturnUpBackOutline size={22} />
            <span>Geri</span>
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Onaylanmış Rezervasyonlarım
          </h2>
          <div className="w-22 hidden md:block"></div>
        </div>

        <div className="w-full flex flex-col gap-5">
          {confirmedRentals && confirmedRentals.length > 0 ? (
            confirmedRentals.map((rental) => (
              <div
                key={rental.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300 gap-6"
              >
                <div className="flex flex-col flex-1 w-full gap-3">
                  <span className="text-xl font-bold text-slate-800">
                    {rental.brand} {rental.modelName} {rental.year}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm w-full">
                    <div className="flex items-start gap-2">
                      <b className="text-slate-700 min-w-12.5">Alış:</b>
                      <span>{rental.start_date?.replace("T", " ")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <b className="text-slate-700 min-w-12.5">İade:</b>
                      <span>{rental.end_date?.replace("T", " ")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <b className="text-slate-700 min-w-12.5">Paket:</b>
                      <span>{rental.packetName || "-"}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <b className="text-slate-700 min-w-12.5">Ekstra:</b>
                      <span className="leading-relaxed">
                        {rental.extras || "Yok"}
                      </span>
                    </div>
                  </div>

                  <span className="text-lg font-bold text-blue-600 mt-1 border-t border-slate-200 pt-3">
                    Toplam Tutar: {rental.totalPrice || rental.totalprice} ₺
                  </span>
                </div>

                <button
                  onClick={() => handleOpenModal(rental.id)}
                  className="w-full md:w-auto px-6 py-3 bg-red-50 text-red-600 border border-red-200 font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer active:scale-[0.99]"
                >
                  İptal Et
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
              <span className="text-lg font-medium text-slate-700 mb-1">
                Henüz onaylanmış bir rezervasyonunuz yok.
              </span>
              <span className="text-sm">
                Yaptığınız kiralamalar burada listelenecektir.
              </span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col items-center text-center transform transition-all">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4 font-bold">
              !
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Emin misiniz?
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Bu rezervasyonu iptal etmek üzeresiniz. Bu işlem geri alınamaz ve
              kiralama hakkınızı kaybedersiniz.
            </p>

            <div className="flex gap-3 w-full">
              <button
                disabled={isCanceling}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                onClick={() => setIsModalOpen(false)}
              >
                Vazgeç
              </button>

              <button
                disabled={isCanceling}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center cursor-pointer active:scale-[0.99]"
                onClick={handleConfirmCancel}
              >
                {isCanceling ? "İptal Ediliyor..." : "Evet, İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedRentals;
