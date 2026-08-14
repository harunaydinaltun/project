/* eslint-disable no-unused-vars */
import api from "../../../utils/api";
import { useState } from "react";
import {
  IoReturnUpBackOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CustomInput } from "../../CustomInput";

export const EditPersonalInformation = ({
  setStep,
  t = {},
  currentUser,
  setCurrentUser,
}) => {
  const [inputs, setInputs] = useState({
    name: currentUser?.name || "",
    surname: currentUser?.surname || "",
    tel_no: currentUser?.tel_no || "",
  });
  const [editing, setEditing] = useState({
    name: false,
    surname: false,
    tel_no: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    tel_no: "",
  });

  const [globalErr, setGlobalErr] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    if (!value || value.trim() === "") {
      return t.emptyFieldError || "Bu alan boş bırakılamaz.";
    }

    if (name === "tel_no") {
      const cleanTelNo = value.replace(/\s+/g, "");
      if (cleanTelNo.length >= 2 && !cleanTelNo.startsWith("05")) {
        return t.telnoError || "Telefon numarası 05 ile başlamalıdır.";
      }
      if (cleanTelNo.length !== 11) {
        return "Telefon numarası 11 haneli olmalıdır.";
      }
    }

    if (name === "name" || name === "surname") {
      if (/[!-/]+/.test(value)) {
        return t[`${name}Error`] || "Özel karakter içeremez.";
      }
    }

    return "";
  };

  const handleCancel = (name) => {
    setInputs((prev) => ({ ...prev, [name]: currentUser?.[name] || "" }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setEditing((prev) => ({ ...prev, [name]: false }));
  };

  const handleConfirm = async (name) => {
    const value = inputs[name];
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
      return;
    }

    const formattedValue =
      name === "tel_no" ? value.replace(/\s+/g, "") : value.trim();

    try {
      await api.patch("/users/profile", { [name]: formattedValue });
      if (setCurrentUser) {
        setCurrentUser((prevUser) => ({
          ...prevUser,
          [name]: formattedValue,
        }));
      }

      setEditing((prev) => ({ ...prev, [name]: false }));
      setGlobalErr(null);
    } catch (error) {
      setGlobalErr("Güncelleme sırasında bir hata oluştu.");
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
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-all active:scale-95"
              >
                <IoCheckmarkOutline size={16} /> Onayla
              </button>
              <button
                onClick={() => handleCancel(name)}
                className="flex items-center gap-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-300 transition-all active:scale-95"
              >
                <IoCloseOutline size={16} /> İptal
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing((prev) => ({ ...prev, [name]: true }))}
              className="flex items-center gap-1 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-all active:scale-95"
            >
              <MdEdit size={16} /> Değiştir
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-12 flex flex-col">
      <button
        className="flex gap-x-1 self-start bg-slate-50 border border-slate-200 rounded-2xl p-2 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer mb-8"
        onClick={() => setStep("")}
      >
        <IoReturnUpBackOutline className="mt-1" />
        <span>Geri</span>
      </button>

      <div className="w-full">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8 flex items-center gap-3">
          <FaUserEdit className="text-blue-600" />
          İletişim Bilgilerini Düzenle
        </h2>

        <div className="space-y-4">
          {renderFieldRow("İsim", "name", "text", 45)}
          {renderFieldRow("Soyisim", "surname", "text", 45)}
          {renderFieldRow("Telefon Numarası", "tel_no", "tel", 11)}

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

export default EditPersonalInformation;
