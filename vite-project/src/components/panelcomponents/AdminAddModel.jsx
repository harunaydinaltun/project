import { useState } from "react";
import {
  FUEL_TYPES,
  GEAR_TYPES,
  BODY_TYPES,
} from "../../constants/carConstants.js";
import api from "../../utils/api.js";

export const AdminAddModel = () => {
  const [inputs, setInputs] = useState({
    brand: "",
    modelName: "",
    year: "",
    trim: "",
    engineSize: "",
    fuelType: "",
    gearType: "",
    bodyType: "",
    doors: "",
    minAge: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setInputs((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (inputs.year < 1940) {
      return setError(
        "Lütfen model yılı için 1940'dan daha büyük bir değer giriniz.",
      );
    }

    if (inputs.doors > 9 || inputs.doors < 1) {
      return setError("Kapı sayısı 1-9 arası değerler olmalıdır");
    }

    const trimmedBrand = inputs.brand.trim();
    const trimmedModelName = inputs.modelName.trim();
    const trimmedTrim = inputs.trim.trim();
    const trimmedEngineSize = inputs.engineSize.trim();

    const formatedInputs = {
      ...inputs,
      brand: trimmedBrand,
      modelName: trimmedModelName,
      trim: trimmedTrim,
      engineSize: trimmedEngineSize,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/models", formatedInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
      setError(null);
      setInputs({
        brand: "",
        modelName: "",
        year: "",
        trim: "",
        engineSize: "",
        fuelType: "",
        gearType: "",
        bodyType: "",
        doors: "",
        minAge: "",
      });
    } catch (error) {
      setError(error.response?.data?.error || "bir hata oluştu");
      setMessage(null);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex flex-col min-w-2xs mt-5">
      <form className="flex flex-col gap-0.5" onSubmit={handleInitialSubmit}>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Marka"
          onChange={handleChange}
          name="brand"
          disabled={isConfirming}
          required
          value={inputs.brand}
        ></input>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Model"
          onChange={handleChange}
          name="modelName"
          disabled={isConfirming}
          required
          value={inputs.modelName}
        ></input>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Trim"
          onChange={handleChange}
          name="trim"
          disabled={isConfirming}
          required
          value={inputs.trim}
        ></input>

        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Engine Size"
          onChange={handleChange}
          name="engineSize"
          disabled={isConfirming}
          required
          value={inputs.engineSize}
        ></input>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="number"
          placeholder="Year"
          onChange={handleChange}
          name="year"
          disabled={isConfirming}
          required
          value={inputs.year}
        ></input>
        <select
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          onChange={handleChange}
          required
          name="fuelType"
          disabled={isConfirming}
          value={inputs.fuelType}
        >
          <option value="">Fuel Type</option>
          {FUEL_TYPES.map((c, index) => (
            <option key={index}>{c}</option>
          ))}
        </select>
        <select
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          onChange={handleChange}
          required
          name="gearType"
          disabled={isConfirming}
          value={inputs.gearType}
        >
          <option value="">Gear Type</option>
          {GEAR_TYPES.map((c, index) => (
            <option key={index}>{c}</option>
          ))}
        </select>
        <select
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          onChange={handleChange}
          disabled={isConfirming}
          required
          name="bodyType"
          value={inputs.bodyType}
        >
          <option value="">Body Type</option>
          {BODY_TYPES.map((c, index) => (
            <option key={index}>{c}</option>
          ))}
        </select>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="number"
          placeholder="Kapı Sayısı"
          onChange={handleChange}
          name="doors"
          disabled={isConfirming}
          required
          value={inputs.doors}
        ></input>
        <input
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="number"
          placeholder="Minumum Yaş Sınırı"
          onChange={handleChange}
          name="minAge"
          disabled={isConfirming}
          required
          value={inputs.minAge}
        ></input>
        {!isConfirming ? (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-shadow-xs font-medium p-3 rounded-lg transition-all text-base mt-2 hover:cursor-pointer hover:scale-[0.99]"
            type="submit"
          >
            Ekle
          </button>
        ) : (
          <div className="flex flex-col justify-center items-stretch gap-1">
            <p className="flex justify-self-center self-center">
              {" "}
              Emin misin?{" "}
            </p>
            <div className="flex gap-0.5">
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white text-shadow-xs font-medium p-3 rounded-lg transition-all text-base mt-2 hover:cursor-pointer hover:scale-[0.99]"
                type="button"
                onClick={() => setIsConfirming(false)}
              >
                İptal
              </button>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white text-shadow-xs font-medium p-3 rounded-lg transition-all text-base mt-2 hover:cursor-pointer hover:scale-[0.99]"
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Onayla
              </button>
            </div>
          </div>
        )}
      </form>
      {error && (
        <span className="text-red-600 text-[13px] flex justify-center">
          {error}
        </span>
      )}
      {message && (
        <span className="text-green-600 text-[13px] flex justify-center">
          {message}
        </span>
      )}
    </div>
  );
};

export default AdminAddModel;
