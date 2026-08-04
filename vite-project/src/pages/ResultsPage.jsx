import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CarCard } from "../components/CarCard";
import SearchSideBar from "../components/SearchSideBar";
import api from "../utils/api";

const ResultsPage = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { startDate, endDate, totalDays } = location.state || {};

  const [cars, setCars] = useState([]);
  const [initialCars, setInitialCars] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    brand: [],
    modelName: [],
    color: [],
    locationId: [],
    bodyType: [],
    doors: [],
    fuelType: [],
    gearType: [],
    minAge: [],
    maxPrice: 15000,
    userAge: 25,
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    if (!startDate || !endDate) {
      navigate("/");
      return;
    }

    api
      .get(`/cars/available?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setInitialCars(res.data.data);
        setCars(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [startDate, endDate, navigate]);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => {
      if (filterKey === "maxPrice" || filterKey === "userAge") {
        return { ...prev, [filterKey]: Number(value) };
      }

      const currentList = prev[filterKey] || [];

      if (currentList.includes(value)) {
        return {
          ...prev,
          [filterKey]: currentList.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [filterKey]: [...currentList, value] };
      }
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const queryParams = new URLSearchParams();
    queryParams.append("startDate", startDate);
    queryParams.append("endDate", endDate);
    queryParams.append("page", currentPage);

    Object.keys(debouncedFilters).forEach((key) => {
      if (key === "maxPrice" || key === "userAge") {
        queryParams.append(key, debouncedFilters[key]);
      } else if (debouncedFilters[key].length > 0) {
        queryParams.append(key, debouncedFilters[key].join(","));
      }
    });

    api
      .get(`/cars/available?${queryParams.toString()}`)
      .then((res) => {
        setCars(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch((err) => console.error(err));
  }, [startDate, endDate, debouncedFilters, currentPage]);

  const availableBrands = [
    ...new Set(initialCars.map((c) => c.brand).filter(Boolean)),
  ];

  const availableModels =
    filters.brand.length > 0
      ? [
          ...new Set(
            initialCars
              .filter((c) => filters.brand.includes(c.brand))
              .map((c) => c.modelName)
              .filter(Boolean),
          ),
        ]
      : [];

  const baseFilteredCars = initialCars.filter((c) => {
    const matchBrand =
      filters.brand.length === 0 || filters.brand.includes(c.brand);
    const matchModel =
      filters.modelName.length === 0 || filters.modelName.includes(c.modelName);
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
            {cars.map((car) => (
              <CarCard
                key={car.car_id || car.id}
                car={car}
                t={t}
                totalDays={totalDays}
                startDate={startDate}
                endDate={endDate}
              />
            ))}
          </div>

          {cars.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              {t.noCarFound}
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
