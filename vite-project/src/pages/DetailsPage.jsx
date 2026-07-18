import { useLocation, useNavigate } from "react-router-dom";

export const DetailsPage = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { car, rentalDays, startDate, endDate } = location.state || {};

  if (!car) {
    return (
      <div>
        <p>{t.noCarDetails}</p>
        <button onClick={() => navigate("/")}>{t.returnHomepage}</button>
      </div>
    );
  }
  const totalPrice = car.deposit + rentalDays * car.daily_price;
  return (
    <div>
      <button onClick={() => navigate(-1)}>{t.return}</button>
      <h2>
        {car.modelDetails.brand} {car.modelDetails.model_name} {t.details}
      </h2>

      <div>
        <h3>{t.summaryOfRental}</h3>
        <p>
          {t.recieveDate}: {startDate}
        </p>
        <p>
          {t.deliveryDate}: {endDate}
        </p>
        <p>
          {t.rentalTime}: {rentalDays}
        </p>
        <p>
          {t.dailyPrice}: {car.daily_price}
        </p>
        <p>
          {t.deposit}: {car.deposit}
        </p>
        <p>
          {t.totalPrice}: {totalPrice}
        </p>
      </div>

      <div>
        <h3>{t.technicalDetails}</h3>
        <p>
          {t.carModel}: {car.modelDetails.brand} {car.modelDetails.model_name}
        </p>
        <p>
          {t.year}: {car.modelDetails.year}
        </p>
        <p>
          {t.fuelType}: {car.modelDetails.fuel_type}
        </p>
        <p>
          {t.gearType}: {car.modelDetails.gear_type}
        </p>
        <p>
          {t.kilometer}: {car.kilometer}
        </p>
        <p>
          {t.color}: {car.color}
        </p>
        <p>
          {t.licensePlate}: {car.license_plate}
        </p>
      </div>
    </div>
  );
};

export default DetailsPage;
