import imgUrl from "../assets/placeholders/car.png";

export const CarCard = ({ t, car, totalDays }) => {
  return (
    <div className="flex flex-col p-2 justify-center items-center bg-slate-50 rounded-2xl hover:shadow-2xl duration-400 min-w-40 max-w-60">
      <img src={imgUrl} alt="Car" className="w-50 " />
      <span className=" text-center leading-relaxed text-2xl text-shadow-lg">
        {car.brand} {car.modelName} {car.year}
      </span>

      <span className="text-shadow-lg">
        {t.totalPrice}: {car.dailyPrice * totalDays + car.deposit}
      </span>
      <span className="text-sm text-shadow-lg">{car.locationId} 🚩</span>
      <button className="bg-blue-300 rounded-xl p-1 cursor-pointer text-shadow-md focus:border-blue-800 hover:bg-blue-400 duration-300">
        Detayları İncele
      </button>
      <div className="flex flex-col items-start w-full mt-1.5 border-t">
        <span className="text-xs text-slate-400">
          {t.dailyPrice}: {car.dailyPrice}
        </span>
        <span className="text-xs text-slate-400">
          {t.deposit}: {car.deposit}
        </span>
      </div>
    </div>
  );
};

export default CarCard;
