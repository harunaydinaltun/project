import { useState } from "react";
import {
  FUEL_TYPES,
  GEAR_TYPES,
  BODY_TYPES,
} from "../../constants/carConstants.js";
import api from "../../utils/api.js";
import { AiFillWarning } from "react-icons/ai";
import { CustomInput } from "../CustomInput.jsx";
import { addModelSchema } from "../../validations/ModelValidations.js";

export const AdminAddModel = ({ setActiveTab }) => {
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

  const [image, setImage] = useState(null);

  const [showModelsModal, setShowModelModal] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setInputs((prev) => ({ ...prev, [name]: finalValue }));

    if (error) setError(null);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Gönderilmeye Hazırlanan Resim:", image);

    const validationResult = addModelSchema.safeParse(inputs);

    if (!validationResult.success) {
      setIsLoading(false);
      setIsConfirming(false);
      return setError(validationResult.error.issues[0].message);
    }

    const formatedInputs = validationResult.data;

    const formData = new FormData();

    Object.keys(formatedInputs).forEach((key) => {
      formData.append(key, formatedInputs[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");

      const res = await api.post("/models", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
      setImage(null);
    } catch (error) {
      setError(error.response?.data?.error || "bir hata oluştu");
      setMessage(null);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex flex-col min-w-2xs mt-5 bg-slate-50 p-3 rounded-2xl shadow-xl">
      <h1 className="flex self-center text-xl font-semibold text-slate-800">
        Model Ekle
      </h1>
      <form className="flex flex-col gap-0.5" onSubmit={handleInitialSubmit}>
        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Marka"
          onChange={handleChange}
          name="brand"
          disabled={isConfirming}
          required
          value={inputs.brand}
        ></CustomInput>
        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Model"
          onChange={handleChange}
          name="modelName"
          disabled={isConfirming}
          required
          value={inputs.modelName}
        ></CustomInput>
        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Trim"
          onChange={handleChange}
          name="trim"
          disabled={isConfirming}
          required
          value={inputs.trim}
        ></CustomInput>

        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Engine Size"
          onChange={handleChange}
          name="engineSize"
          disabled={isConfirming}
          required
          value={inputs.engineSize}
        ></CustomInput>
        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="number"
          placeholder="Year"
          onChange={handleChange}
          name="year"
          disabled={isConfirming}
          required
          value={inputs.year}
        ></CustomInput>
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
        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="number"
          placeholder="Kapı Sayısı"
          onChange={handleChange}
          name="doors"
          disabled={isConfirming}
          required
          value={inputs.doors}
        ></CustomInput>
        <CustomInput
          className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          type="number"
          placeholder="Minumum Yaş Sınırı"
          onChange={handleChange}
          name="minAge"
          disabled={isConfirming}
          required
          value={inputs.minAge}
        ></CustomInput>
        <div className="flex flex-col gap-1 my-1">
          <span className="text-center w-full border-b">Model Resmi Seç</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            disabled={isConfirming}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer disabled:opacity-50"
          />
        </div>
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
        <span className="text-red-600 text-[13px] flex justify-center mt-2 text-center">
          {error}
        </span>
      )}
      {message && (
        <span className="text-green-600 text-[13px] flex justify-center mt-2 text-center">
          {message}
        </span>
      )}
      {showModelsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="flex flex-col bg-slate-50 w-fit h-fit rounded-2xl p-15 justify-center items-center shadow-2xl ring-1 ring-slate-200">
            <div className="text-red-600">
              <AiFillWarning size={40} />
            </div>
            <span className="text-xl text-slate-800 font-semibold text-center mt-2">
              Yeni bir model eklemeden önce mevcut modelleri görüntülemeniz
              tavsiye edilir
            </span>
            <div className="flex gap-x-3 w-3/4 justify-evenly mt-6">
              <button
                className="flex-1 text-base bg-blue-600 text-slate-100 p-2 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.99] duration-200 cursor-pointer"
                onClick={() => setActiveTab("showmodels")}
              >
                Modelleri Görüntüle
              </button>
              <button
                className="flex-1 text-base bg-slate-400 text-slate-50 p-2 rounded-xl font-semibold hover:bg-slate-500 active:scale-[0.99] duration-200 cursor-pointer"
                onClick={() => {
                  setShowModelModal(false);
                }}
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

export default AdminAddModel;
