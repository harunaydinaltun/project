import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

export const CarCard = ({
  t,
  car,
  totalDays,
  startDate,
  endDate,
  pickUpLocation,
  dropOffLocation,
}) => {
  const { formatPrice } = useCurrency();
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
    <div className="flex flex-col p-3 bg-slate-50 rounded-2xl hover:shadow-2xl duration-400 min-w-40 max-w-60 h-full">
      <div className="h-40 w-40 shrink-0 mb-3 self-center">
        <img
          src={
            car.img
              ? `http://localhost:8800${car.img}`
              : new URL(
                  `../assets/placeholders/car-${car.color}.png`,
                  import.meta.url,
                ).href
          }
          alt={`${car.color} Car`}
          className="w-full h-full object-cover rounded-xl ring-1 ring-slate-200"
        />
      </div>

      <div className="flex flex-col flex-1 w-full text-center">
        <span className="leading-relaxed text-xl text-shadow-lg mb-1 text-slate-800 font-semibold">
          {car.brand} {car.modelName} {car.year}
        </span>

        <span className="text-shadow-lg text-slate-600 font-medium mb-3">
          {t.totalPrice}: {formatPrice(car.dailyPrice * totalDays)}
        </span>

        <div className="mt-auto flex flex-col w-full">
          <button
            onClick={handleViewDetails}
            className="w-full bg-cyan-500 rounded-xl p-2 text-slate-100 font-medium text-shadow-md hover:bg-cyan-600 duration-300 cursor-pointer active:scale-[0.99] mb-3"
          >
            {t.viewDetails}
          </button>

          <div className="flex flex-col items-start w-full pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              {t.dailyPrice}: {formatPrice(car.dailyPrice)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t.deposit}: {formatPrice(car.deposit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
