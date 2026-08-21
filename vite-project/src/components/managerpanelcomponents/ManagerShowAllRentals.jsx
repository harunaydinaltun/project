import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useLocations } from "../../context/LocationContext";

export const ManagerShowAllRentals = ({ locId }) => {
  const { getLocationName } = useLocations();
  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/rentals/getAllByLocId?locId=${locId}`);
        setRentals(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold border border-yellow-200">
            Onaylandı / Bekliyor
          </span>
        );
      case "active":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
            Kullanımda
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-bold border border-slate-300">
            Tamamlandı
          </span>
        );
      case "canceled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold border border-red-200">
            İptal Edildi
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
            {status}
          </span>
        );
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="flex flex-col mt-3">
      {rentals && rentals.length > 0 ? (
        rentals.map((rental) => (
          <div
            key={rental.id}
            className="flex flex-col p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300 gap-4"
          >
            <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-2 sm:gap-0">
              <span className="text-xl font-bold text-slate-800">
                Rezervasyon ID: {rental.id}{" "}
              </span>
              {/* Dinamik Durum Rozeti */}
              {getStatusBadge(rental.status)}
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-semibold text-slate-800">
                {rental.customerName} {rental.customerSurname}
              </span>
              <span className="text-lg font-bold text-slate-800">
                {rental.brand} {rental.modelName} {rental.year} -{" "}
                {rental.licensePlate}
              </span>
            </div>

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

            <div className="flex justify-end mt-1 border-t border-slate-200 pt-3">
              <span className="text-lg font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                Toplam Tutar: {rental.totalPrice} ₺
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
          <span className="text-lg font-medium text-slate-700 mb-1">
            Bu şubeye ait herhangi bir kiralama kaydı bulunmuyor.
          </span>
        </div>
      )}
    </div>
  );
};

export default ManagerShowAllRentals;
