import { useState } from "react";

export const AdminAddModel = ({ t }) => {
  const [modelForm, setModelForm] = useState({
    brand: "",
    model_name: "",
    year: "",
    fuel_type: "",
    gear_type: "",
    body_type: "",
    doors: "",
    min_age: "",
  });

  const handleModelChange = (e) => {
    const { name, value } = e.target;
    setModelForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddModel = async () => {
    if (
      !modelForm.brand.trim() ||
      !modelForm.brand.trim() ||
      !modelForm.model_name.trim() ||
      !modelForm.year.trim() ||
      !modelForm.fuel_type.trim() ||
      !modelForm.gear_type.trim() ||
      !modelForm.body_type.trim() ||
      !modelForm.doors.trim() ||
      !modelForm.min_age.trim()
    ) {
      alert("Lütfen her alanı doldurun!");
      return;
    }
    if (
      isNaN(Number(modelForm.year)) ||
      isNaN(Number(modelForm.doors)) ||
      isNaN(Number(modelForm.min_age))
    ) {
      alert(
        "Lütfen yıl, kapı sayısı, ve minumum yaş alanlarını geçerli bir sayı girin",
      );
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/car_models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: modelForm.brand.trim(),
          model_name: modelForm.model_name.trim(),
          year: Number(modelForm.year),
          fuel_type: modelForm.fuel_type.trim(),
          gear_type: modelForm.gear_type.trim(),
          body_type: modelForm.body_type.trim(),
          doors: Number(modelForm.doors),
          min_age: Number(modelForm.min_age),
        }),
      });
      if (response.ok) {
        const addedModel = await response.json();
        alert(`model başarıyla eklendi id: ${addedModel.id}`);
        setModelForm({
          brand: "",
          model_name: "",
          year: "",
          fuel_type: "",
          gear_type: "",
          body_type: "",
          doors: "",
          min_age: "",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <h1>{t.addNewModel}</h1>
      <input
        type="text"
        name="brand"
        placeholder={t.brand}
        value={modelForm.brand}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="model_name"
        placeholder={t.model}
        value={modelForm.model_name}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="fuel_type"
        placeholder={t.fuelType}
        value={modelForm.fuel_type}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="gear_type"
        placeholder={t.gearType}
        value={modelForm.gear_type}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="year"
        placeholder={t.year}
        value={modelForm.year}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="body_type"
        placeholder={t.bodyType}
        value={modelForm.body_type}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="doors"
        placeholder={t.doors}
        value={modelForm.doors}
        onChange={handleModelChange}
      />
      <br />
      <input
        type="text"
        name="min_age"
        placeholder={t.minAge}
        value={modelForm.min_age}
        onChange={handleModelChange}
      />
      <br />
      <button onClick={handleAddModel}>{t.add}</button>
    </div>
  );
};

export default AdminAddModel;
