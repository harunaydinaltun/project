import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CarCard } from "../components/CarCard";
import axios from "axios";
import SearchSideBar from "../components/SearchSideBar";

const ResultsPage = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { startDate, endDate, totalDays } = location.state || {};

  const [cars, setCars] = useState([]);

  const [filters, setFilters] = useState({
    brand: null,
    modelName: null,
    color: null,
    locationId: null,
  });

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value,
    }));
  };

  console.log("backende gelen araç verisi", cars);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    axios
      .get(`http://localhost:8800/api/cars/available?${queryParams.toString()}`)
      .then((res) => setCars(res.data))
      .catch((err) => console.error(err));
  }, [startDate, endDate, filters]);

  return (
    <div>
      <SearchSideBar
        t={t}
        filters={filters}
        onFilterChange={handleFilterChange}
      ></SearchSideBar>
      {cars.map((car) => (
        <CarCard key={car.id} car={car} t={t} totalDays={totalDays}></CarCard>
      ))}
    </div>
  );
};

export default ResultsPage;
