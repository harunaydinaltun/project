import { useEffect, useState } from "react";
import api from "../../utils/api";
import { AiFillWarning } from "react-icons/ai";

export const AdminShowModels = () => {
  const [count, setCount] = useState("");
  const [isEditModal, setIsModalPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allModels, setAllModels] = useState([]);

  const handleButton = async (id) => {
    try {
      const response = await api.get(`/cars/countByModel?id=${id}`);
      setCount(response.data.data[0].count);
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalPopUp(true);
    }
  };

  useEffect(() => {
    const fetchAllModels = async () => {
      try {
        setLoading(true);
        const response = await api.get("/models");
        setAllModels(response.data.data);
      } catch (error) {
        console.log("Başlangıç Hatası");
      } finally {
        setLoading(false);
      }
    };
    fetchAllModels();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-600 font-medium">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Modelleri Görüntüle
      </h2>

      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                <th className="p-4">Marka / Model</th>
                <th className="p-4">Yıl</th>
                <th className="p-4">Kasa Tipi</th>
                <th className="p-4">Motor / Trim</th>
                <th className="p-4">Vites / Yakıt</th>
                <th className="p-4 text-center">Düzenle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {allModels.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">
                    Gösterilecek model bulunamadı.
                  </td>
                </tr>
              ) : (
                allModels.map((model) => (
                  <tr
                    key={model.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-900">
                      {model.brand} {model.modelName}
                    </td>
                    <td className="p-4">{model.year}</td>
                    <td className="p-4">{model.bodyType}</td>
                    <td className="p-4">
                      {model.engineSize} ({model.trim})
                    </td>
                    <td className="p-4">
                      {model.gearType} / {model.fuelType}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 ring ring-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 active:scale-[0.99] transition-all cursor-pointer duration-200"
                          onClick={() => handleButton(model.id)}
                        >
                          Düzenle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-cente items-center">
            <AiFillWarning size={60} className="text-red-600" />
            <span className="text-xl font-semibold">DİKKAT!</span>
            <span className="text-lg font-semibold text-slate-900">
              {" "}
              Bu Modele Bağlı Araç Sayısı: {count}
            </span>
            <div className="flex gap-x-1">
              <button
                className="flex-1 p-2 bg-red-600 ring ring-red-500 rounded-lg text-slate-50 font-semibold hover:bg-red-700 active:scale-[0.99] cursor-pointer duration-200 "
                onClick={() => {
                  setCount("");
                  setIsModalPopUp(false);
                }}
              >
                Kapat
              </button>
              <button
                className="flex-1 p-2 bg-slate-200 ring ring-slate-100 rounded-lg text-slate-900 font-semibold hover:bg-slate-300 active:scale-[0.99] cursor-pointer duration-200"
                onClick={() => {
                  setCount("");
                  setIsModalPopUp(false);
                }}
              >
                Düzenlemeye Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShowModels;
