import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ResultsPage = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startDate, endDate } = location.state || {};
  const [filteredCars, setFilteredCars] = useState([]);

  const calculateDays = () => {
    if (!startDate || !endDate) {
      return 1;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differensInTime = end.getTime() - start.getTime();
    const differenceInDays =
      Math.ceil(differensInTime / (1000 * 3600 * 24)) + 1;

    return differenceInDays > 0 ? differenceInDays : 1;
  };

  const rentalDays = calculateDays();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const [carsRes, rentalsRes, modelsRes] = await Promise.all([
          fetch("http://localhost:3001/cars"),
          fetch("http://localhost:3001/rentals"),
          fetch("http://localhost:3001/car_models"),
        ]);

        const cars = await carsRes.json();
        const rentals = await rentalsRes.json();
        const models = await modelsRes.json();

        const userStart = new Date(startDate);
        const userEnd = new Date(endDate);

        const availableCars = cars.filter((car) => {
          const carRentals = rentals.filter(
            (rental) => rental.car_id === car.id,
          );

          const hasCollison = carRentals.some((rental) => {
            const rentalStart = new Date(rental.startDate);
            const rentalEnd = new Date(rental.endDate);

            return rentalStart <= userEnd && rentalEnd >= userStart;
          });
          return !hasCollison;
        });

        const detailedCars = availableCars.map((car) => {
          const carModel =
            models.find((model) => model.id === car.model_id) || {};
          return {
            ...car,
            modelDetails: carModel,
          };
        });

        setFilteredCars(detailedCars);
      } catch (error) {
        console.log("Hata:", error.message);
      }
    };
    if (startDate && endDate) {
      fetchCars();
    }
  }, [startDate, endDate]);

  const handleGoToDetails = (car) => {
    navigate(`/details/${car.id}`, {
      state: { car, rentalDays, startDate, endDate },
    });
  };

  return (
    <div>
      <h2>
        {t.searchResults} ({rentalDays} {t.days})
      </h2>
      {filteredCars.length === 0 ? (
        <p>{t.noAvailableCarsInSelectedDates}</p>
      ) : (
        <div className="car-list-container">
          {filteredCars.map((car) => {
            const totalPrice = car.deposit + rentalDays * car.daily_price;

            return (
              <div
                key={car.id}
                className="car-card"
                onClick={() => handleGoToDetails(car)}
                style={{ cursor: "pointer" }}
              >
                <h3>
                  {car.modelDetails.brand} {car.modelDetails.model_name}
                </h3>
                <p>
                  {t.deposit}: {car.deposit} TL
                </p>
                <p>
                  {t.dailyPrice}: {car.daily_price} TL
                </p>
                <p>
                  <strong>{t.totalPrice}:</strong> {totalPrice} TL
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
