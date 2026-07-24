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
  const [initialCars, setInitialCars] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    brand: null,
    modelName: null,
    color: null,
    locationId: null,
    bodyType: null,
    doors: null,
    fuelType: null,
    gearType: null,
    minAge: null,
  });

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value,
    }));

    setCurrentPage(1);
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      navigate("/");
      return;
    }

    axios
      .get(
        `http://localhost:8800/api/cars/available?startDate=${startDate}&endDate=${endDate}`,
      )
      .then((res) => {
        setInitialCars(res.data);
        setCars(res.data);
      })
      .catch((err) => console.error(err));
  }, [startDate, endDate, navigate]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const queryParams = new URLSearchParams();
    queryParams.append("startDate", startDate);
    queryParams.append("endDate", endDate);

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

  const availableBrands = [
    ...new Set(initialCars.map((c) => c.brand).filter(Boolean)),
  ];

  const availableModels = filters.brand
    ? [
        ...new Set(
          initialCars
            .filter((c) => c.brand === filters.brand)
            .map((c) => c.modelName)
            .filter(Boolean),
        ),
      ]
    : [];

  const baseFilteredCars = initialCars.filter((c) => {
    const matchBrand = filters.brand ? c.brand === filters.brand : true;
    const matchModel = filters.modelName
      ? c.modelName === filters.modelName
      : true;
    return matchBrand && matchModel;
  });

  const availableColors = [
    ...new Set(baseFilteredCars.map((c) => c.color).filter(Boolean)),
  ];
  const availableBodyTypes = [
    ...new Set(baseFilteredCars.map((c) => c.bodyType).filter(Boolean)),
  ];
  const availableDoors = [
    ...new Set(baseFilteredCars.map((c) => c.doors).filter(Boolean)),
  ];
  const availableFuelTypes = [
    ...new Set(baseFilteredCars.map((c) => c.fuelType).filter(Boolean)),
  ];
  const availableGearTypes = [
    ...new Set(baseFilteredCars.map((c) => c.gearType).filter(Boolean)),
  ];
  const availableMinAges = [
    ...new Set(baseFilteredCars.map((c) => c.minAge).filter(Boolean)),
  ];

  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;

  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex gap-6 p-4">
      <SearchSideBar
        t={t}
        filters={filters}
        brands={availableBrands}
        models={availableModels}
        colors={availableColors}
        bodyTypes={availableBodyTypes}
        doors={availableDoors}
        fuelTypes={availableFuelTypes}
        gearTypes={availableGearTypes}
        minAges={availableMinAges}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3">
            {currentCars.map((car) => (
              <CarCard
                key={car.car_id || car.id}
                car={car}
                t={t}
                totalDays={totalDays}
              />
            ))}
          </div>

          {cars.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              Aradığınız kriterlere uygun araç bulunamadı.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              ‹ {t.previousPage}
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-slate-800 text-white shadow"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {t.nextPage} ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
