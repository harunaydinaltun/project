import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CAR_COLORS, CAR_STATUS } from "../constants/carConstants";

export const AdminEditCarPage = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state;

  const [carForm, setCarForm] = useState({
    license_plate: car.license_plate,
    color: car.color,
    daily_price: car.daily_price,
    deposit: car.deposit,
    kilometer: car.kilometer,
    location_id: car.location_id,
    status: car.status,
  });

  if (!car) {
    return (
      <div>
        <p>{t.noCarDetails}</p>
        <button onClick={() => navigate("/")}>{t.returnHomepage}</button>
        <button onClick={() => navigate(-1)}>{t.return} </button>
      </div>
    );
  }

  const handleAttributeChange = (field, value) => {
    setCarForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();

    if (
      isNaN(Number(carForm.kilometer)) ||
      isNaN(Number(carForm.daily_price)) ||
      isNaN(Number(carForm.deposit)) ||
      isNaN(Number(carForm.location_id))
    ) {
      alert("Lütfen geçerli değerler giriniz");
      return;
    }

    const updatedData = {
      license_plate: carForm.license_plate,
      color: carForm.color,
      daily_price: Number(carForm.daily_price),
      deposit: Number(carForm.deposit),
      kilometer: Number(carForm.kilometer),
      location_id: Number(carForm.location_id),
      status: carForm.status,
    };

    try {
      const response = await fetch(`http://localhost:3001/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Güncelleme başarılı");
        navigate(-1);
      } else {
        alert("Güncelleme sırasında bir hata oluştu");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fieldsConfig = [
    { key: "license_plate", label: t.licensePlate, type: "text" },
    { key: "color", label: t.color, isSelect: true, options: CAR_COLORS },
    { key: "daily_price", label: t.dailyPrice, type: "text" },
    { key: "deposit", label: t.deposit, type: "text" },
    { key: "kilometer", label: t.kilometer, type: "text" },
    { key: "location_id", label: t.locationId, type: "text" },
    { key: "status", label: t.status, isSelect: true, options: CAR_STATUS },
  ];

  return (
    <div>
      <button onClick={() => navigate(-1)}>{t.return}</button>

      <form onSubmit={handleUpdateCar}>
        {fieldsConfig.map((field) => (
          <div key={field.key}>
            <label>{field.label}</label>

            {field.isSelect ? (
              <select
                value={carForm[field.key]}
                onChange={(e) =>
                  handleAttributeChange(field.key, e.target.value)
                }
              >
                {field.options.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={carForm[field.key]}
                onChange={(e) =>
                  handleAttributeChange(field.key, e.target.value)
                }
              />
            )}
          </div>
        ))}

        <button type="submit">{"Save Changes"}</button>
      </form>
    </div>
  );
};

export default AdminEditCarPage;
