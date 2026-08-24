import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useLocations } from "../../context/LocationContext";
import { useCurrency } from "../../context/CurrencyContext";

export const ManagerShowConfirmedRentals = ({ locId }) => {
  const { formatPrice } = useCurrency();
  const { getLocationName } = useLocations();
  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [selectedRentalId, setSelectedRentalId] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url =
          appliedSearch !== ""
            ? `/rentals/getConfirmedByLocId?locId=${locId}&rentalId=${appliedSearch}`
            : `/rentals/getConfirmedByLocId?locId=${locId}`;

        const res = await api.get(url);
        setRentals(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locId, appliedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
  };

  const handleConfirm = async (id) => {
    try {
      await api.patch("/rentals/setactive", { rentalId: id });
      setRentals((prevRentals) =>
        prevRentals.filter((rental) => rental.id !== id),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmModal(false);
      setSelectedRentalId("");
    }
  };
  const handleCancel = async (id) => {
    try {
      await api.patch("/rentals/cancelById", { rentalId: id });
      setRentals((prevRentals) =>
        prevRentals.filter((rental) => rental.id !== id),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setCancelModal(false);
      setSelectedRentalId("");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  return (
    <div className="flex flex-col mt-3">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          placeholder="Rezervasyon ID ile ara..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm active:scale-[0.99]"
          >
            Ara
          </button>
          {appliedSearch !== "" && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors active:scale-[0.99]"
            >
              Temizle
            </button>
          )}
        </div>
      </form>
      {rentals && rentals.length > 0 ? (
        rentals.map((rental) => (
          <div
            key={rental.id}
            className="flex flex-col p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300 gap-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-slate-800">
                Rezervasyon ID: {rental.id}{" "}
              </span>
              <span className="text-xl font-bold text-slate-800">
                {rental.brand} {rental.modelName} {rental.year} -{" "}
                {rental.licensePlate}
              </span>
            </div>
            <span className="text-lg font-semibold text-slate-800">
              {" "}
              {rental.customerName} {rental.customerSurname}{" "}
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
                <b className="text-slate-700 min-w-12.5">Alış Şube:</b>
                <span>{getLocationName(rental.pickup_location_id)}</span>
              </div>
              <div className="flex items-start gap-2">
                <b className="text-slate-700 min-w-12.5">İade Şube:</b>
                <span>{getLocationName(rental.return_location_id)}</span>
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
            <div className="flex justify-evenly mt-1 border-t border-slate-200 pt-2">
              <span className="text-lg font-bold text-blue-600 p-3">
                Toplam Tutar: {formatPrice(rental.totalPrice)}
              </span>
              <button
                className="text-lg font-bold bg-red-500 text-white rounded-2xl ring ring-red-400 shadow-md active:scale-[0.99] cursor-pointer p-3"
                onClick={() => {
                  setSelectedRentalId(rental.id);
                  setCancelModal(true);
                }}
              >
                İptal Et
              </button>
              <button
                className="text-lg font-bold bg-green-500 text-white rounded-2xl ring ring-green-400 shadow-md active:scale-[0.99] cursor-pointer p-3"
                onClick={() => {
                  setSelectedRentalId(rental.id);
                  setConfirmModal(true);
                }}
              >
                Onay Ver
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
          <span className="text-lg font-medium text-slate-700 mb-1">
            Bu şubede işlem bekleyen (onaylanmış) rezervasyon bulunmuyor.
          </span>
        </div>
      )}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              {selectedRentalId} numaralı rezervasyonu AKTİF hale getirmek
              istediğinizden emin misiniz?
            </h3>
            <div className="flex justify-evenly mt-1">
              <button
                className="bg-slate-300 text-slate-600 font-semibold ring ring-slate-200 shadow-md p-3 rounded-2xl active:scale-[0.99] cursor-pointer"
                onClick={() => {
                  setSelectedRentalId("");
                  setConfirmModal(false);
                }}
              >
                Vazgeç
              </button>
              <button
                className="bg-green-500 text-white font-semibold ring ring-green-400 shadow-md p-3 rounded-2xl active:scale-[0.99] cursor-pointer"
                onClick={() => handleConfirm(selectedRentalId)}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              {selectedRentalId} numaralı rezervasyonu İPTAL ETMEK
              istediğinizden emin misiniz?
            </h3>
            <div className="flex justify-evenly mt-1">
              <button
                className="bg-slate-300 text-slate-600 font-semibold ring ring-slate-200 shadow-md p-3 rounded-2xl active:scale-[0.99] cursor-pointer"
                onClick={() => {
                  setSelectedRentalId("");
                  setCancelModal(false);
                }}
              >
                Vazgeç
              </button>
              <button
                className="bg-red-500 text-white font-semibold ring ring-red-400 shadow-md p-3 rounded-2xl active:scale-[0.99] cursor-pointer"
                onClick={() => handleCancel(selectedRentalId)}
              >
                Rezervasyonu İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerShowConfirmedRentals;
