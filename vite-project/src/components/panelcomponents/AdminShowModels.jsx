/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { AiFillWarning } from "react-icons/ai";

export const AdminShowModels = ({ onEdit }) => {
  const [count, setCount] = useState("");
  const [isEditModal, setIsModalPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allModels, setAllModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  const handleEditButton = async (model) => {
    try {
      setSelectedModel(model);
      const response = await api.get(`/cars/countByModel?id=${model.id}`);
      setCount(response.data.data[0].count);
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalPopUp(true);
    }
  };

  const handleCloseEditModal = () => {
    setCount("");
    setSelectedModel(null);
    setIsModalPopUp(false);
  };

  const handleContinueEditModal = () => {
    onEdit({ model: selectedModel, count });
    setIsModalPopUp(false);
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
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Modelleri Görüntüle
      </h2>

      <div className="bg-transparent md:bg-white md:shadow-xl md:ring-1 md:ring-slate-100">
        <table className="w-full block md:table text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
              <th className="p-4">Marka / Model</th>
              <th className="p-4">Yıl</th>
              <th className="p-4">Kasa Tipi</th>
              <th className="p-4">Motor / Trim</th>
              <th className="p-4">Vites / Yakıt</th>
              <th className="p-4 text-center">Düzenle</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group text-sm text-slate-700">
            {allModels.length === 0 ? (
              <tr className="block md:table-row bg-white rounded-xl shadow-sm md:shadow-none p-4">
                <td
                  colSpan="6"
                  className="block md:table-cell text-center p-6 text-slate-400"
                >
                  Gösterilecek model bulunamadı.
                </td>
              </tr>
            ) : (
              allModels.map((model) => (
                <tr
                  key={model.id}
                  className="block md:table-row bg-white mb-4 md:mb-0 border border-slate-200 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none hover:bg-slate-50/80 transition-colors"
                >
                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Marka / Model
                    </span>
                    <span className="font-semibold text-slate-900">
                      {model.brand} {model.modelName}
                    </span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Yıl
                    </span>
                    <span>{model.year}</span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Kasa Tipi
                    </span>
                    <span>{model.bodyType}</span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Motor / Trim
                    </span>
                    <span>
                      {model.engineSize} ({model.trim})
                    </span>
                  </td>

                  <td className="flex justify-between items-center md:table-cell p-3 md:p-4 border-b border-slate-100 md:border-none">
                    <span className="md:hidden font-semibold text-slate-500 text-xs uppercase">
                      Vites / Yakıt
                    </span>
                    <span>
                      {model.gearType} / {model.fuelType}
                    </span>
                  </td>

                  <td className="flex justify-center items-center md:table-cell p-4">
                    <button
                      type="button"
                      className="w-full md:w-auto px-4 py-2 md:px-3 md:py-1.5 bg-blue-50 text-blue-600 ring ring-blue-200 rounded-lg text-sm md:text-xs font-medium hover:bg-blue-100 active:scale-[0.99] transition-all cursor-pointer duration-200"
                      onClick={() => handleEditButton(model)}
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center items-center">
            <AiFillWarning size={60} className="text-red-600" />
            <span className="text-xl font-semibold mt-2">DİKKAT!</span>
            <span className="text-lg font-semibold text-slate-900 mb-6">
              Bu Modele Bağlı Araç Sayısı: {count}
            </span>
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 p-3 md:p-2 bg-red-600 ring ring-red-500 rounded-lg text-slate-50 font-semibold hover:bg-red-700 active:scale-[0.99] cursor-pointer duration-200"
                onClick={handleCloseEditModal}
              >
                Kapat
              </button>
              <button
                className="flex-1 p-3 md:p-2 bg-slate-200 ring ring-slate-100 rounded-lg text-slate-900 font-semibold hover:bg-slate-300 active:scale-[0.99] cursor-pointer duration-200"
                onClick={handleContinueEditModal}
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShowModels;
