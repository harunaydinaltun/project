/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { RentalDatePicker } from "../components/RentalDatePicker";

export const CarDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPopped, setIsPopped] = useState(false);

  const passedCar = location.state?.car;
  const passedStartDate = location.state?.startDate;
  const passedEndDate = location.state?.endDate;

  const splitDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: "", time: "10:00" };
    const [date, time] = dateTimeStr.split("T");
    return { date, time: time ? time.substring(0, 5) : "10:00" };
  };

  const initStart = splitDateTime(passedStartDate);
  const initEnd = splitDateTime(passedEndDate);

  const [car, setCar] = useState(passedCar || null);
  const [loading, setLoading] = useState(!passedCar);
  const [error, setError] = useState(null);

  const [pickUpDate, setPickUpDate] = useState(initStart.date);
  const [pickUpTime, setPickUpTime] = useState(initStart.time);
  const [dropOffDate, setDropOffDate] = useState(initEnd.date);
  const [dropOffTime, setDropOffTime] = useState(initEnd.time);

  const isDateValid = pickUpDate && dropOffDate;
  const startDate = isDateValid ? `${pickUpDate}T${pickUpTime}` : "";
  const endDate = isDateValid ? `${dropOffDate}T${dropOffTime}` : "";

  let totalPrice = 0;
  let daysDiff = 0;

  if (isDateValid && car?.dailyPrice) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 0) {
      totalPrice = daysDiff * car.dailyPrice + (car.deposit || 0);
    }
  }

  useEffect(() => {
    if (car) return;

    const fetchCarDetails = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        setError("Araç bilgisi yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id, car]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (!car) return <div>Araç bulunamadı.</div>;

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-6 p-4 w-full">
      <div className="bg-slate-50 flex flex-col justify-center items-center rounded-xl shadow-xl p-5 md:p-8 gap-4 ring-1 ring-slate-300 w-full max-w-4xl">
        <img
          className="max-w-62.5 md:max-w-xs object-contain"
          src={
            car.img ||
            new URL(
              `../assets/placeholders/car-${car.color}.png`,
              import.meta.url,
            ).href
          }
          alt={`${car.brand} ${car.modelName}`}
        />
        <h2 className="text-2xl text-slate-900 font-bold text-center">
          {car.brand} {car.modelName} {car.year}
        </h2>
        <h3 className="text-lg text-slate-700 font-semibold text-center mb-2">
          {car.trim} • {car.fuelType} • {car.gearType} • {car.engineSize}
        </h3>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex flex-1 flex-col p-5 bg-slate-200 rounded-xl ring-1 ring-slate-300 gap-1.5">
            <h2 className="self-center font-bold text-slate-800 border-b border-slate-300 w-full text-center pb-2 mb-2">
              Teknik Detaylar
            </h2>
            <span>
              <b>Plaka:</b> {car.licensePlate}
            </span>
            <span>
              <b>Marka:</b> {car.brand}
            </span>
            <span>
              <b>Model:</b> {car.modelName}
            </span>
            <span>
              <b>Gövde:</b> {car.bodyType}
            </span>
            <span>
              <b>Yıl:</b> {car.year}
            </span>
            <span>
              <b>Vites:</b> {car.gearType}
            </span>
            <span>
              <b>Yakıt:</b> {car.fuelType}
            </span>
            <span>
              <b>Motor Hacmi:</b> {car.engineSize}
            </span>
            <span>
              <b>Kapı Sayısı:</b> {car.doors}
            </span>
            <span>
              <b>Renk:</b> {car.color}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5 bg-slate-200 rounded-xl ring-1 ring-slate-300 gap-1.5">
            <h2 className="self-center font-bold text-slate-800 border-b border-slate-300 w-full text-center pb-2 mb-2">
              Kiralama Detayları
            </h2>

            {!isDateValid || daysDiff <= 0 ? (
              <div className="flex flex-col items-center my-2 p-3 bg-amber-100 border border-amber-300 text-amber-800 rounded-lg shadow-sm">
                <span className="font-semibold text-center">
                  Lütfen Aşağıdan Tarih Seçiniz
                </span>
                <span className="text-xs text-center mt-1">
                  Fiyat hesaplaması için tarih gereklidir.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 bg-white p-3 rounded-lg border border-slate-300 my-2">
                <span>
                  <b>Alış:</b> {startDate.replace("T", " ")}
                </span>
                <span>
                  <b>İade:</b> {endDate.replace("T", " ")}
                </span>
                <span>
                  <b>Toplam Süre:</b> {daysDiff} Gün
                </span>
                <span className="font-bold text-lg text-blue-700 mt-2 border-t pt-2">
                  Toplam Fiyat: {totalPrice.toFixed(2)}₺
                </span>
              </div>
            )}

            <span>
              <b>Günlük Fiyat:</b> {car.dailyPrice}₺
            </span>
            <span>
              <b>Deposito:</b> {car.deposit}₺
            </span>
            <span>
              <b>Min. Yaş:</b> {car.minAge}
            </span>
            <span>
              <b>Alış Noktası:</b> {car.locationId}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <button
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-4 rounded-lg cursor-pointer transition-transform active:scale-[0.98] ring-1 ring-slate-300 duration-200"
            onClick={() => setIsPopped(true)}
          >
            Tarihleri Belirle
          </button>
          <button
            disabled={!isDateValid || daysDiff <= 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-transform active:scale-[0.98] ring-1 ring-blue-700 duration-200 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => navigate("/checkout")}
          >
            Kiralamaya Devam Et
          </button>
        </div>
      </div>

      {isPopped && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">
              Tarihleri Değiştir
            </h2>

            <RentalDatePicker
              pickUpDate={pickUpDate}
              setPickUpDate={setPickUpDate}
              pickUpTime={pickUpTime}
              setPickUpTime={setPickUpTime}
              dropOffDate={dropOffDate}
              setDropOffDate={setDropOffDate}
              dropOffTime={dropOffTime}
              setDropOffTime={setDropOffTime}
            />

            <button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer transition-transform active:scale-[0.98] duration-200"
              onClick={() => setIsPopped(false)}
            >
              Kaydet ve Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage;
