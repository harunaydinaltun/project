import { useEffect, useState } from "react";
import {
  IoReturnUpBackOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import api from "../../utils/api";
import { CustomInput } from "../../components/CustomInput";
import { useLocations } from "../../context/LocationContext";

export const AdminEditLocInfo = ({ setActiveTab, selectedBranchId }) => {
  const { getLocationName } = useLocations();
  const [loading, setLoading] = useState(false);
  const [locData, setLocData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState({
    name: "",
    value: null,
    managerDetails: null,
  });

  const [inputs, setInputs] = useState({
    name: "",
    full_address: "",
    city: "",
    branch_manager_id: "",
  });

  const [editing, setEditing] = useState({
    name: false,
    full_address: false,
    city: false,
    branch_manager_id: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    full_address: "",
    city: "",
    branch_manager_id: "",
  });

  const [globalErr, setGlobalErr] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBranchId) return;
      try {
        setLoading(true);

        const [locRes, managersRes] = await Promise.all([
          api.get(`/locations/getlocinfo?locId=${selectedBranchId}`),
          api.get(`/locations/managers`),
        ]);

        const location = locRes.data.data[0];

        setLocData(location);
        setManagers(managersRes.data.data || []);

        setInputs({
          name: location?.name || "",
          full_address: location?.full_address || "",
          city: location?.city || "",
          branch_manager_id: location?.branch_manager_id || "",
        });
      } catch (error) {
        console.log(error);
        setGlobalErr("Bilgiler yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBranchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue =
      name === "branch_manager_id" && value !== "" ? Number(value) : value;

    setInputs((prev) => ({ ...prev, [name]: finalValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = (name) => {
    setInputs((prev) => ({ ...prev, [name]: locData?.[name] || "" }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setEditing((prev) => ({ ...prev, [name]: false }));
  };

  const executeUpdate = async (name, validValue) => {
    try {
      await api.patch(`/locations/editlocinfo?locId=${selectedBranchId}`, {
        [name]: validValue,
      });

      setLocData((prev) => ({ ...prev, [name]: validValue }));
      setEditing((prev) => ({ ...prev, [name]: false }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setGlobalErr(null);
      setConfirmModal(false);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Güncelleme sırasında bir hata oluştu.";
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
      setConfirmModal(false);
    }
  };

  const handleConfirm = async (name) => {
    const validValue = inputs[name];

    if (name === "branch_manager_id" && validValue !== "") {
      const selectedManager = managers.find((m) => m.id === validValue);

      if (
        selectedManager?.location_id &&
        selectedManager.location_id !== Number(selectedBranchId)
      ) {
        setPendingUpdate({
          name,
          value: validValue,
          managerDetails: selectedManager,
        });
        setConfirmModal(true);
        return;
      }
    }

    await executeUpdate(name, validValue);
  };

  const renderFieldRow = (
    label,
    name,
    type = "text",
    maxLength,
    options = [],
  ) => {
    const isEditing = editing[name];
    let displayValue = inputs[name];
    if (type === "select" && name === "branch_manager_id") {
      const selectedManager = managers.find((m) => m.id === inputs[name]);
      displayValue = selectedManager
        ? `${selectedManager.name} ${selectedManager.surname}`
        : inputs[name]
          ? "Bilinmeyen Müdür"
          : "Atanmadı";
    }

    return (
      <div className="flex items-start justify-between gap-4 w-full border-b border-slate-100 pb-4">
        <div className="grow max-w-sm">
          {isEditing ? (
            type === "select" ? (
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-semibold mb-1">
                  {label}
                </span>
                <select
                  name={name}
                  value={inputs[name]}
                  onChange={handleChange}
                  className={`bg-white rounded-sm p-1 pl-2 text-slate-700 min-h-8] w-full border outline-none transition-colors ${
                    errors[name]
                      ? "border-red-400"
                      : "border-slate-300 focus:border-blue-400"
                  }`}
                >
                  <option value="">Seçiniz</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} {opt.surname}{" "}
                      {opt.location_id
                        ? `| Şubeye Kayıtlı: ${getLocationName(opt.location_id)} `
                        : `| MÜSAİT`}
                    </option>
                  ))}
                </select>
                {errors[name] && (
                  <span className="text-xs text-red-500 mt-1 font-medium">
                    {errors[name]}
                  </span>
                )}
              </div>
            ) : (
              <CustomInput
                label={label}
                type={type}
                name={name}
                value={inputs[name]}
                onChange={handleChange}
                error={errors[name]}
                maxLength={maxLength}
              />
            )
          ) : (
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-semibold mb-1">
                {label}
              </span>
              <div className="bg-slate-50 rounded-sm p-1 pl-2 text-slate-700 min-h-8 flex items-center border border-slate-200">
                {displayValue || "-"}
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

  if (loading) return <div className="p-8">Yükleniyor...</div>;

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
          Lokasyon Bilgilerini Düzenle
        </h2>

        <div className="space-y-4">
          {renderFieldRow("Şube Adı", "name", "text", 100)}
          {renderFieldRow("Şehir", "city", "text", 50)}
          {renderFieldRow("Açık Adres", "full_address", "text", 255)}
          {renderFieldRow(
            "Şube Müdürü",
            "branch_manager_id",
            "select",
            null,
            managers,
          )}

          {globalErr && (
            <p className="text-sm text-red-600 font-semibold mt-4">
              {globalErr}
            </p>
          )}
        </div>
      </div>
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 animate-fade-in">
          <div className="flex flex-col bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 text-center border border-slate-100">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              !
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Emin misiniz?
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Seçtiğiniz yönetici (
              <strong>
                {pendingUpdate.managerDetails?.name}{" "}
                {pendingUpdate.managerDetails?.surname}
              </strong>
              ) şu anda halihazırda{" "}
              <strong>
                {getLocationName(pendingUpdate.managerDetails?.location_id)} ID:{" "}
                {pendingUpdate.managerDetails?.location_id}
              </strong>{" "}
              numaralı şubede görev yapmaktadır. <br />
              <br />
              Onaylarsanız, yöneticinin eski şubesiyle olan bağı kopartılacak ve
              bu şubeye atanacaktır.
            </p>
            <div className="flex justify-evenly gap-3">
              <button
                className="flex-1 bg-slate-100 text-slate-700 font-semibold border border-slate-200 hover:bg-slate-200 p-3 rounded-2xl active:scale-[0.98] transition-all cursor-pointer"
                onClick={() => {
                  setConfirmModal(false);
                  setPendingUpdate({
                    name: "",
                    value: null,
                    managerDetails: null,
                  });
                }}
              >
                İptal Et
              </button>
              <button
                className="flex-1 bg-blue-600 text-white font-semibold ring ring-blue-200 shadow-md hover:bg-blue-700 p-3 rounded-2xl active:scale-[0.98] transition-all cursor-pointer"
                onClick={() =>
                  executeUpdate(pendingUpdate.name, pendingUpdate.value)
                }
              >
                Yine de Ata
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditLocInfo;
