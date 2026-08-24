import { useState } from "react";
import { IoReturnUpBackOutline, IoCheckmarkOutline } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import api from "../../utils/api";
import { CustomInput } from "../../components/CustomInput";

export const AdminAddLocation = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [inputs, setInputs] = useState({
    name: "",
    city: "",
    full_address: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/locations/addloc", inputs);
      setMessage({ type: "success", text: "Şube başarıyla eklendi!" });
      setInputs({ name: "", city: "", full_address: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Şube eklenirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col">
      <button
        className="flex gap-x-1 self-start bg-slate-50 border border-slate-200 rounded-2xl p-2 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer mb-8"
        onClick={() => setActiveTab("branches")}
      >
        <IoReturnUpBackOutline className="mt-1" />
        <span>Geri Dön</span>
      </button>

      <div className="w-full">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8 flex items-center gap-3">
          <FaBuilding className="text-blue-600" />
          Yeni Şube Ekle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="Şube Adı"
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <CustomInput
            label="Şehir"
            type="text"
            name="city"
            value={inputs.city}
            onChange={handleChange}
            maxLength={50}
            required
          />

          <CustomInput
            label="Açık Adres"
            type="text"
            name="full_address"
            value={inputs.full_address}
            onChange={handleChange}
            maxLength={255}
            required
          />

          {message.text && (
            <div
              className={`p-4 rounded-xl font-medium text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
            >
              <IoCheckmarkOutline size={20} />
              {loading ? "Ekleniyor..." : "Şubeyi Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddLocation;
