import { useEffect, useState } from "react";
import api from "../../utils/api";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useLocations } from "../../context/LocationContext";

export const AdminShowBranchDetails = ({
  selectedBranchId,
  setActiveTab,
  activeTab,
}) => {
  const [loading, setLoading] = useState(false);
  const [fleetData, setFleetData] = useState([]);
  const { getLocationName } = useLocations();

  const getStatus = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            Kirada (Aktif)
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            Rezerve (Onaylı)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            Müsait
          </span>
        );
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/cars/getcarsbylocationid?locationId=${selectedBranchId}`,
        );

        setFleetData(res.data.data);
      } catch (error) {
        console.log("Filo verisi çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedBranchId) {
      fetchDetails();
    }
  }, [selectedBranchId]);

  if (loading) return <div className="p-4 text-slate-600">Yükleniyor...</div>;

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        {activeTab === "showbranchdetails" && (
          <button
            onClick={() => setActiveTab("branches")}
            className="flex px-4 py-2 gap-0.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium cursor-pointer duration-200"
          >
            <IoReturnUpBackOutline className="mt-0.5 mr-0.5" />
            Geri Dön
          </button>
        )}
        <h2 className="lg:text-2xl md:text-sm font-semibold text-slate-800">
          Şube Filo Detayları ({getLocationName(selectedBranchId)})
        </h2>
      </div>

      <div className="bg-transparent md:bg-white md:shadow-xl md:ring-1 md:ring-slate-100 rounded-xl overflow-hidden">
        <table className="w-full block md:table text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
              <th className="p-4">Marka</th>
              <th className="p-4">Model Adı</th>
              <th className="p-4 text-center">Yıl</th>
              <th className="p-4 text-center">Plaka</th>
              <th className="p-4 text-center">Durum</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group text-sm text-slate-700">
            {fleetData.length === 0 ? (
              <tr className="block md:table-row bg-white rounded-xl shadow-sm md:shadow-none p-4">
                <td
                  colSpan="4"
                  className="block md:table-cell text-center p-6 text-slate-400"
                >
                  Bu şubeye ait araç bulunamadı.
                </td>
              </tr>
            ) : (
              fleetData.map((car) => (
                <tr
                  key={car.licensePlate}
                  className="block md:table-row bg-white mb-4 md:mb-0 border border-slate-200 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none hover:bg-slate-50/80 transition-colors"
                >
                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Marka
                    </span>
                    <span className="font-semibold text-slate-900">
                      {car.brand}
                    </span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Model Adı
                    </span>
                    <span>{car.modelName}</span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none md:text-center">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Yıl
                    </span>
                    <span>{car.year}</span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none md:text-center">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Plaka
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {car.licensePlate}
                    </span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none md:text-center">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Durum
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-gray-800">
                      {getStatus(car.currentStatus)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShowBranchDetails;
