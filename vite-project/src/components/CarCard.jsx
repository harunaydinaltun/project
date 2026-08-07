import { useNavigate } from "react-router-dom";

export const CarCard = ({
  t,
  car,
  totalDays,
  startDate,
  endDate,
  pickUpLocation,
  dropOffLocation,
}) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (pickUpLocation) queryParams.append("pickUpLocation", pickUpLocation);
    if (dropOffLocation) queryParams.append("dropOffLocation", dropOffLocation);

    navigate(`/cars/${car.car_id}?${queryParams.toString()}`, {
      state: { car, totalDays, startDate, endDate },
    });
  };
  return (
    <div className="flex flex-col p-2 justify-center items-center bg-slate-50 rounded-2xl hover:shadow-2xl duration-400 min-w-40 max-w-60">
      <img
        src={
          new URL(
            `../assets/placeholders/car-${car.color}.png`,
            import.meta.url,
          ).href
        }
        alt={`${car.color} Car`}
        className="w-50 ring-1"
      />
      <span className=" text-center leading-relaxed text-xl text-shadow-lg">
        {car.brand} {car.modelName} {car.year}
      </span>

      <span className="text-shadow-lg">
        {t.totalPrice}: {car.dailyPrice * totalDays}₺
      </span>
      <span className="text-sm text-shadow-lg">{car.locationId} 🚩</span>
      <button
        onClick={handleViewDetails}
        className="bg-cyan-500 rounded-xl p-1 cursor-pointert text-slate-200 text-shadow-md focus:border-cyan-600 hover:bg-cyan-700 duration-300 cursor-pointer active:scale-[0.99]"
      >
        {t.viewDetails}
      </button>
      <div className="flex flex-col items-start w-full mt-1.5 border-t">
        <span className="text-xs text-slate-400">
          {t.dailyPrice}: {car.dailyPrice}₺
        </span>
        <span className="text-xs text-slate-400">
          {t.deposit}: {car.deposit}₺
        </span>
      </div>
    </div>
  );
};

export default CarCard;
