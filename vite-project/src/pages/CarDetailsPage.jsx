import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const CarDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedCar = location.state?.car;
  const passedStartDate = location.state?.startDate;
  const passedEndDate = location.state?.endDate;

  const [car, setCar] = useState(passedCar || null);
  const [loading, setLoading] = useState(!passedCar);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(passedStartDate || "");
  const [endDate, setEndDate] = useState(passedEndDate || "");

  let totalPrice = 0;
  if (startDate && endDate && car?.dailyPrice) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 0) {
      totalPrice = daysDiff * car.dailyPrice + (car.deposit || 0);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (car) return;

    const fetchCarDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/cars/${id}`);
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
    <div>
      <p>id: {car.car_id}</p>
      <p>brand: {car.brand}</p>
      <p>model: {car.modelName}</p>
      <p>plaka: {car.licensePlate}</p>
      <p>color: {car.color}</p>
      <p>body: {car.bodyType}</p>
      <p>gear: {car.gearType}</p>
      <p>fuel: {car.fuelType}</p>
      <p>totalPrice {totalPrice}</p>
    </div>
  );
};

export default CarDetailsPage;
