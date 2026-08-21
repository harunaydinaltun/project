import api from "../../utils/api";
import { useState } from "react";
import {
  IoReturnUpBackOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { CustomInput } from "../CustomInput";
import { addModelSchema } from "../../validations/ModelValidations.js";
import { AiFillWarning } from "react-icons/ai";

export const AdminEditModel = ({ model, count, onBack }) => {
  const [inputs, setInputs] = useState({
    brand: model?.brand || "",
    modelName: model?.modelName || "",
    trim: model?.trim || "",
    engineSize: model?.engineSize || "",
    year: model?.year || "",
    fuelType: model?.fuelType || "",
    gearType: model?.gearType || "",
    bodyType: model?.bodyType || "",
    doors: model?.doors || "",
    minAge: model?.minAge || "",
  });

  const [editing, setEditing] = useState({
    brand: false,
    modelName: false,
    trim: false,
    engineSize: false,
    year: false,
    fuelType: false,
    gearType: false,
    bodyType: false,
    doors: false,
    minAge: false,
  });

  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState(null);

  const handleChange = (e) => {
    let { name, value, type } = e.target;
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setInputs((prev) => ({ ...prev, [name]: finalValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = (name) => {
    setInputs((prev) => ({ ...prev, [name]: model?.[name] || "" }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setEditing((prev) => ({ ...prev, [name]: false }));
  };

  const handleConfirm = async (name) => {
    const valueToValidate = inputs[name];

    const fieldSchema = addModelSchema.shape[name];
    const validationResult = fieldSchema.safeParse(valueToValidate);

    if (!validationResult.success) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationResult.error.issues[0].message,
      }));
      return;
    }

    const validValue = validationResult.data;

    try {
      await api.patch(`/models/${model.id}`, { [name]: validValue });

      setInputs((prev) => ({ ...prev, [name]: validValue }));
      setEditing((prev) => ({ ...prev, [name]: false }));
      setGlobalErr(null);
    } catch (error) {
      setGlobalErr(
        error.response?.data?.error || "Güncelleme sırasında bir hata oluştu.",
      );
    }
  };

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(`/models/${model.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resim başarıyla güncellendi!");
      setGlobalErr(null);
    } catch (error) {
      setGlobalErr(
        error.response?.data?.error || "Resim güncellenirken bir hata oluştu.",
      );
    }
  };

  const renderFieldRow = (label, name, type = "text", maxLength) => {
    const isEditing = editing[name];

    return (
      <div className="flex items-start justify-between gap-4 w-full border-b border-slate-100 pb-4">
        <div className="grow max-w-sm">
          {isEditing ? (
            <CustomInput
              label={label}
              type={type}
              name={name}
              value={inputs[name]}
              onChange={handleChange}
              error={errors[name]}
              maxLength={maxLength}
              disabled={false}
            />
          ) : (
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-semibold mb-1">
                {label}
              </span>
              <div className="bg-slate-50 rounded-sm p-1 pl-2 text-slate-700 h-8 flex items-center border border-slate-200">
                {inputs[name]}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-5">
          {isEditing ? (
            <>
              <button
                onClick={() => handleConfirm(name)}
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-all active:scale-95 cursor-pointer"
              >
                <IoCheckmarkOutline size={16} /> Onayla
              </button>
              <button
                onClick={() => handleCancel(name)}
                className="flex items-center gap-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-300 transition-all active:scale-95 cursor-pointer"
              >
                <IoCloseOutline size={16} /> İptal
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing((prev) => ({ ...prev, [name]: true }))}
              className="flex items-center gap-1 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-all active:scale-95 cursor-pointer"
            >
              <MdEdit size={16} /> Değiştir
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col mt-5">
      <div className="flex justify-between items-center mb-8">
        <button
          className="flex gap-x-1 self-start bg-slate-50 border border-slate-200 rounded-2xl p-2 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
          onClick={onBack}
        >
          <IoReturnUpBackOutline className="mt-1" />
          <span>Geri</span>
        </button>
        <div className="flex flex-col justify-center items-center px-4 py-2 rounded-xl text-sm font-semibold">
          <AiFillWarning size={20} className="text-red-600 mb-1" />
          <span className="bg-red-200 ring ring-red-600 rounded-lg p-1">
            Bu modele bağlı {count} araç bulunmaktadır.
          </span>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8 flex items-center gap-3">
          <FaCar className="text-blue-600" />
          Model Bilgilerini Düzenle
        </h2>

        <div className="space-y-4">
          {renderFieldRow("Marka", "brand", "text", 45)}
          {renderFieldRow("Model Adı", "modelName", "text", 45)}
          {renderFieldRow("Donanım (Trim)", "trim", "text", 45)}
          {renderFieldRow("Motor Hacmi", "engineSize", "text", 45)}
          {renderFieldRow("Üretim Yılı", "year", "number")}
          {renderFieldRow("Yakıt Tipi", "fuelType", "text", 45)}
          {renderFieldRow("Vites Tipi", "gearType", "text", 45)}
          {renderFieldRow("Kasa Tipi", "bodyType", "text", 45)}
          {renderFieldRow("Kapı Sayısı", "doors", "number")}
          {renderFieldRow("Minimum Yaş", "minAge", "number")}
          <div className="flex items-center justify-between gap-4 w-full border-b border-slate-100 pb-6 mb-4">
            <div className="flex flex-col grow max-w-sm">
              <span className="text-xs text-slate-500 font-semibold mb-2">
                Model Resmi
              </span>
              {model?.img && (
                <img
                  src={`http://localhost:8800${model.img}`}
                  alt="Mevcut Model"
                  className="w-32 h-24 object-cover rounded-lg border shadow-sm mb-3"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpdate}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
              />
            </div>
          </div>

          {globalErr && (
            <p className="text-sm text-red-600 font-semibold mt-4">
              {globalErr}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditModel;
