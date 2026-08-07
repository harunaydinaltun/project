/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import api from "../utils/api";

export const CarDetailsPage = () => {
  const { currentUser, logout } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loginPage, setLoginPage] = useState(false);

  const startDate = searchParams.get("startDate") || location.state?.startDate;
  const endDate = searchParams.get("endDate") || location.state?.endDate;
  const pickUpLocation =
    searchParams.get("pickUpLocation") || location.state?.pickUpLocation;
  const dropOffLocation =
    searchParams.get("dropOffLocation") || location.state?.dropOffLocation;

  const passedCar = location.state?.car;
  const [car, setCar] = useState(passedCar || null);
  const [loading, setLoading] = useState(!passedCar);
  const [error, setError] = useState(null);

  const isDateValid = startDate && endDate;
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
              <div className="flex flex-col items-center my-2 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg shadow-sm">
                <span className="font-semibold text-center">
                  Geçerli bir kiralama aralığı bulunamadı!
                </span>
                <span className="text-sm text-center mt-1">
                  Güvenliğiniz ve araç müsaitliği için lütfen ana sayfadan tarih
                  seçerek arama yapın.
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
                  <b>Alış Şubesi:</b> {pickUpLocation}
                </span>
                <span>
                  <b>İade Şubesi:</b> {dropOffLocation}
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
          </div>
        </div>

        <div className="flex gap-3 w-full mt-4">
          {!isDateValid || daysDiff <= 0 ? (
            <button
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-transform active:scale-[0.98] duration-200"
              onClick={() => navigate("/")}
            >
              Ana Sayfaya Dön ve Ara
            </button>
          ) : currentUser ? (
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-transform active:scale-[0.98] ring-1 ring-blue-700 duration-200"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    car,
                    startDate,
                    endDate,
                    pickUpLocation,
                    dropOffLocation,
                    daysDiff,
                    totalPrice,
                  },
                })
              }
            >
              Kiralamaya Devam Et
            </button>
          ) : (
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-transform active:scale-[0.98] ring-1 ring-green-700 duration-200"
              onClick={() =>
                navigate("/login", {
                  state: {
                    car,
                    startDate,
                    endDate,
                    pickUpLocation,
                    dropOffLocation,
                  },
                })
              }
            >
              Devam Etmek İçin Giriş Yap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
