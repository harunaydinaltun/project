import { useState } from "react";

export const AdminAddCar = ({ t }) => {
  const [carForm, setCarForm] = useState({
    model_id: "",
    license_plate: "",
    kilometer: "",
    color: "",
    daily_price: "",
    deposit: "",
    location_id: "",
    status: "",
  });

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCarForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCar = async () => {
    if (
      !carForm.model_id.trim() ||
      !carForm.license_plate.trim() ||
      !carForm.kilometer.trim() ||
      !carForm.color.trim() ||
      !carForm.daily_price.trim() ||
      !carForm.deposit.trim() ||
      !carForm.location_id.trim() ||
      !carForm.status.trim()
    ) {
      alert("Lütfen her alanı doldurun!");
      return;
    }

    if (
      isNaN(Number(carForm.model_id)) ||
      isNaN(Number(carForm.kilometer)) ||
      isNaN(Number(carForm.daily_price)) ||
      isNaN(Number(carForm.deposit)) ||
      isNaN(Number(carForm.location_id))
    )
      try {
        const response = await fetch("http://localhost:3001/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model_id: Number(carForm.model_id),
            license_plate: carForm.license_plate,
            kilometer: Number(carForm.kilometer),
            color: carForm.color,
            daily_price: Number(carForm.daily_price),
            deposit: Number(carForm.deposit),
            location_id: Number(carForm.location_id),
            status: carForm.status,
          }),
        });
        if (response.ok) {
          const addedModel = await response.json();
          alert(`araba başarıyla eklendi id: ${addedModel.id}`);
          setCarForm({
            model_id: "",
            license_plate: "",
            kilometer: "",
            color: "",
            daily_price: "",
            deposit: "",
            location_id: "",
            status: "",
          });
        }
      } catch (error) {
        console.log(error.message);
      }
  };

  return (
    <div>
      <h1>{t.addNewCar}</h1>
      <input
        type="text"
        placeholder={t.model}
        name="model_id"
        value={carForm.model_id}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.licensePlate}
        name="license_plate"
        value={carForm.license_plate}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.kilometer}
        name="kilometer"
        value={carForm.kilometer}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.color}
        name="color"
        value={carForm.color}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.dailyPrice}
        name="daily_price"
        value={carForm.daily_price}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.deposit}
        name="deposit"
        value={carForm.deposit}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.locationId}
        name="location_id"
        value={carForm.location_id}
        onChange={handleCarChange}
      />
      <br />
      <input
        type="text"
        placeholder={t.status}
        name="status"
        value={carForm.status}
        onChange={handleCarChange}
      />
      <br />
      <button onClick={handleAddCar}>{t.add}</button>
    </div>
  );
};
export default AdminAddCar;
