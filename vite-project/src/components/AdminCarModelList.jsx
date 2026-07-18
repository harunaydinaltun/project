import { useEffect, useState } from "react";

export const AdminCarModelList = ({ t }) => {
  const [carModels, setCarModels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carModelsResponse = await fetch(
          "http://localhost:3001/car_models",
        );
        const carModelsData = await carModelsResponse.json();
        console.log("Gelen Veri Model Verisi:", carModelsData);
        setCarModels(carModelsData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t.carModelList}</h1>
      <ul>
        {carModels.map((model) => (
          <li className="border-2 mb-1" key={model.id}>
            <div>Model ID: {model.id}</div>
            <div>
              {t.brand}: {model.brand}
            </div>
            <div>
              {t.model}: {model.model_name}
            </div>
            <div>
              {t.year}: {model.year}
            </div>
            <div>
              {t.fuelType}: {model.fuel_type}
            </div>
            <div>
              {t.gearType}: {model.gear_type}
            </div>
            <div>
              {t.bodyType}: {model.body_type}
            </div>
            <div>
              {t.doors}: {model.doors}
            </div>
            <div>
              {t.minAge}: {model.min_age}
            </div>
            <button>{t.edit}</button>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCarModelList;
