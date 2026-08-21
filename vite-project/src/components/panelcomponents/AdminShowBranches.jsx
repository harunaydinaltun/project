import { useEffect, useState } from "react";
import api from "../../utils/api";

export const AdminShowBranches = ({ setActiveTab, setSelectedBranchId }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const res = await api.get("/locations/allLocationInformations");
        setLocations(res.data.data || []);
      } catch (error) {
        console.error("Lokasyonlar çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <div>Yükleniyor</div>;

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Şubeleri Görüntüle
      </h2>
      <div className="bg-transparent md:bg-white md:shadow-xl md:ring-1 md:ring-slate-100">
        <table className="w-full block md:table text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
              <th className="p-4">Şube</th>
              <th className="p-4">Tam Adres</th>
              <th className="p-4">Şehir</th>
              <th className="p-4">Şube Müdürü / Kullanıcı ID</th>
              <th className="p-4 text-center">Düzenle</th>
              <th className="p-4 text-center">Filoyu Görüntüle</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group text-sm text-slate-700">
            {locations.length === 0 ? (
              <tr className="block md:table-row bg-white rounded-xl shadow-sm md:shadow-none p-4">
                <td
                  colSpan="6"
                  className="block md:table-cell text-center p-6 text-slate-400"
                >
                  Gösterilecek model bulunamadı.
                </td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr
                  key={loc.locationId}
                  className="block md:table-row bg-white mb-4 md:mb-0 border border-slate-200 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none hover:bg-slate-50/80 transition-colors"
                >
                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Şube
                    </span>
                    <span className="font-semibold text-slate-900">
                      {loc.locationName}
                    </span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Tam Adres
                    </span>
                    <span>{loc.fullAddress}</span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Şehir
                    </span>
                    <span>{loc.city}</span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Şube Müdürü / Kullanıcı ID
                    </span>
                    <span>
                      {loc.managerName} {loc.managerSurname} /{" "}
                      {loc.managerId}{" "}
                    </span>
                  </td>

                  <td className="flex justify-center items-center md:table-cell p-4">
                    <button
                      type="button"
                      className="w-full md:w-auto px-4 py-2 md:px-3 md:py-1.5 bg-blue-50 text-blue-600 ring ring-blue-200 rounded-lg text-sm md:text-xs font-medium hover:bg-blue-100 active:scale-[0.99] transition-all cursor-pointer duration-200"
                      onClick={() => {
                        setSelectedBranchId(loc.locationId);
                        setActiveTab("editlocinfo");
                      }}
                    >
                      Düzenle
                    </button>
                  </td>
                  <td className="flex justify-center items-center md:table-cell p-4">
                    <button
                      type="button"
                      className="w-full md:w-auto px-4 py-2 md:px-3 md:py-1.5 bg-green-50 text-green-600 ring ring-green-200 rounded-lg text-sm md:text-xs font-medium hover:bg-blue-100 active:scale-[0.99] transition-all cursor-pointer duration-200"
                      onClick={() => {
                        setSelectedBranchId(loc.locationId);
                        setActiveTab("showbranchdetails");
                      }}
                    >
                      Görüntüle
                    </button>
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

export default AdminShowBranches;
