import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminEditCar = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state;

  const [formData, setFormData] = useState({
    license_plate: "",
    color: "",
    daily_price: "",
    deposit: "",
    kilometer: "",
    location_id: "",
    status: "",
  });

  // Sistemde izin verdiğiniz standart araba renkleri dizisi
  const carColors = [
    "Red",
    "Blue",
    "Black",
    "White",
    "Grey",
    "Silver",
    "Green",
  ];

  if (!car) {
    return (
      <div className="p-4 text-center">
        <p>{t.noCarDetails}</p>
        <button className="border p-1 m-2" onClick={() => navigate("/")}>
          {t.returnHomepage}
        </button>
        <button className="border p-1 m-2" onClick={() => navigate(-1)}>
          {t.return}
        </button>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateField = async (field) => {
    const newValue = formData[field];
    if (!newValue || newValue.trim() === "") {
      alert("Lütfen geçerli bir değer seçiniz veya giriniz.");
      return;
    }

    const numericFields = [
      "daily_price",
      "deposit",
      "kilometer",
      "location_id",
    ];
    const payloadValue = numericFields.includes(field)
      ? Number(newValue)
      : newValue;

    try {
      const response = await fetch(`http://localhost:3001/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: payloadValue }),
      });

      if (response.ok) {
        alert("Güncelleme başarılı!");
      } else {
        alert("Güncelleme başarısız.");
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    }
  };

  // fieldsConfig dizimize "options" ve "isSelect" özelliklerini ekledik
  const fieldsConfig = [
    {
      key: "license_plate",
      label: t.licensePlate,
      currentVal: car.license_plate,
      type: "text",
    },
    {
      key: "color",
      label: t.color,
      currentVal: car.color,
      isSelect: true, // select kontrolü olduğunu belirtiyoruz
      options: carColors, // hangi renklerin listeleneceğini veriyoruz
    },
    {
      key: "daily_price",
      label: t.dailyPrice,
      currentVal: car.daily_price,
      type: "number",
    },
    {
      key: "deposit",
      label: t.deposit,
      currentVal: car.deposit,
      type: "number",
    },
    {
      key: "kilometer",
      label: t.kilometer,
      currentVal: car.kilometer,
      type: "number",
    },
    {
      key: "location_id",
      label: t.locationId,
      currentVal: car.location_id,
      type: "number",
    },
    { key: "status", label: t.status, currentVal: car.status, type: "text" },
  ];

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <button
        className="border-2 p-1 px-4 mb-4 rounded-xl"
        onClick={() => navigate(-1)}
      >
        {t.return}
      </button>

      {fieldsConfig.map((field) => (
        <div
          key={field.key}
          className="m-1.5 border-2 p-2 rounded-2xl flex flex-col items-center w-80"
        >
          <p className="font-semibold text-center">
            {field.label}:{" "}
            <span className="text-gray-600">{field.currentVal}</span>
          </p>
          <div className="flex gap-2 mt-2 w-full">
            {/* Eğer alan bir select (seçim) alanıysa bu render edilir */}
            {field.isSelect ? (
              <select
                className="border p-1 rounded flex-1 text-sm bg-white"
                value={formData[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                <option value="">{t.selectColor || "Select Color"}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              // Değilse standart input render edilmeye devam eder
              <input
                className="border p-1 rounded flex-1 text-sm"
                type={field.type}
                placeholder="Input"
                value={formData[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            )}

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              onClick={() => handleUpdateField(field.key)}
            >
              Change
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminEditCar;
