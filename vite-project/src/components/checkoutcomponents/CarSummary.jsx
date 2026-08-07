export const CarSummary = ({ car, daysDiff, totalPrice }) => {
  return (
    <div className="bg-slate-200">
      <div className="flex flex-col p-2 justify-center items-center bg-slate-50 rounded-2xl min-w-60 max-w-60">
        <img
          src={
            new URL(
              `../../assets/placeholders/car-${car.color}.png`,
              import.meta.url,
            ).href
          }
          alt={`${car.color} Car`}
          className="w-50 ring-1"
        />
        <span className="text-2xl border-b">
          {car.brand} {car.modelName} {car.year}{" "}
        </span>
        <div className="w-full ml-13 flex flex-col">
          <span>
            <b>Fuel: </b>
            {car.fuelType}
          </span>
          <span>
            <b>Gear: </b>
            {car.gearType}
          </span>
          <span>
            <b>Engine: </b>
            {car.engineSize}
          </span>
          <span>
            <b>Trim: </b>
            {car.trim}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarSummary;
