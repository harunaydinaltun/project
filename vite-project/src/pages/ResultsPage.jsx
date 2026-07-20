import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Home.jsx'ten gönderilen verileri güvenle teslim al
  const { startDate, endDate } = location.state || {};

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Eğer birisi URL'ye direkt /results yazıp girdiyse, Home'a geri şutla
    if (!startDate || !endDate) {
      navigate("/");
      return;
    }

    // Node.js Controller'ına (car.js) GET isteği at
    // startDate ve endDate'i URL query parametresi olarak ekliyoruz
    axios
      .get(
        `http://localhost:8800/api/cars/available?start_date=${startDate}&end_date=${endDate}`,
      )
      .then((res) => {
        setCars(res.data); // Controller'ın döndüğü 'availableCars' JSON'u
        setLoading(false);
      })
      .catch((err) => {
        console.error("Veri çekilemedi:", err);
        setLoading(false);
      });
  }, [startDate, endDate, navigate]);

  // Yükleme ekranı
  if (loading) return <h2>Uygun araçlar MySQL'den çekiliyor...</h2>;

  return (
    <div style={{ padding: "50px" }}>
      <h2>
        Seçilen Tarihler: {startDate} ile {endDate} Arası
      </h2>

      {cars.length === 0 ? (
        <p>Bu tarihlerde uygun araç maalesef yok.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {cars.map((car) => (
            <div
              key={car.id}
              style={{ border: "1px solid #ccc", padding: "15px" }}
            >
              <h3>
                {car.brand} {car.model}
              </h3>
              <p>Günlük Fiyat: {car.daily_price} TL</p>
              <button onClick={() => navigate(`/checkout/${car.id}`)}>
                Kirala
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
