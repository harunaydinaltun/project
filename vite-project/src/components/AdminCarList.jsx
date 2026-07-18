import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminCarList = ({ t }) => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsResponse = await fetch("http://localhost:3001/cars");
        const carsData = await carsResponse.json();
        console.log("Gelen Kayıtlı Araba Verisi:", carsData);
        setCars(carsData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleGoToEdit = (car) => {
    navigate(`/edit/${car.id}`, { state: car });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t.carList}</h1>
      <ul>
        {cars.map((car) => (
          <li className="border-2 mb-1" key={car.id}>
            <div>ID: {car.id}</div>
            <div>Model ID: {car.model_id}</div>
            <div>
              {t.licensePlate}: {car.license_plate}
            </div>
            <div>
              {t.color}: {car.color}
            </div>
            <div>
              {t.dailyPrice}: {car.daily_price}
            </div>
            <div>
              {t.deposit}: {car.deposit}
            </div>
            <div>
              {t.locationId}: {car.location_id}
            </div>
            <div>
              {t.status}: {car.status}
            </div>
            <button
              className="cursor-pointer border-t-2 border-r-2 p-0.5"
              onClick={() => handleGoToEdit(car)}
            >
              {t.edit}
            </button>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCarList;
