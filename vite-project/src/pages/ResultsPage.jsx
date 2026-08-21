import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CarCard } from "../components/CarCard";
import SearchSideBar from "../components/SearchSideBar";
import api from "../utils/api";
import RentalDatePicker from "../components/RentalDatePicker";

const ResultsPage = ({ t }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPoppedUp, setIsPoppedUp] = useState(false);

  const locationState = location.state || {};
  const [activeStartDate, setActiveStartDate] = useState(
    locationState.startDate,
  );
  const [activeEndDate, setActiveEndDate] = useState(locationState.endDate);
  const [activePickUpLocation, setActivePickUpLocation] = useState(
    locationState.pickUpLocation,
  );
  const [activeDropOffLocation, setActiveDropOffLocation] = useState(
    locationState.dropOffLocation,
  );
  const [activeTotalDays, setActiveTotalDays] = useState(
    locationState.totalDays || 1,
  );

  const [tempPickUpDate, setTempPickUpDate] = useState("");
  const [tempPickUpTime, setTempPickUpTime] = useState("");
  const [tempDropOffDate, setTempDropOffDate] = useState("");
  const [tempDropOffTime, setTempDropOffTime] = useState("");
  const [tempPickUpLocation, setTempPickUpLocation] = useState("");
  const [tempDropOffLocation, setTempDropOffLocation] = useState("");

  const [cars, setCars] = useState([]);
  const [initialCars, setInitialCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    brand: [],
    modelName: [],
    trim: [],
    engineSize: [],
    color: [],
    bodyType: [],
    doors: [],
    fuelType: [],
    gearType: [],
    minAge: [],
    maxPrice: 15000,
    userAge: 18,
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const handleOpenPopUp = () => {
    if (activeStartDate) {
      const [pDate, pTime] = activeStartDate.split(/[T\s]/);
      setTempPickUpDate(pDate);
      setTempPickUpTime(pTime?.substring(0, 5) || "10:00");
    }
    if (activeEndDate) {
      const [dDate, dTime] = activeEndDate.split(/[T\s]/);
      setTempDropOffDate(dDate);
      setTempDropOffTime(dTime?.substring(0, 5) || "10:00");
    }
    setTempPickUpLocation(activePickUpLocation);
    setTempDropOffLocation(activeDropOffLocation);

    setIsPoppedUp(true);
  };

  const handleConfirmDates = () => {
    const newStartDate = `${tempPickUpDate} ${tempPickUpTime}:00`;
    const newEndDate = `${tempDropOffDate} ${tempDropOffTime}:00`;

    const start = new Date(newStartDate);
    const end = new Date(newEndDate);
    const diffTime = Math.abs(end - start);
    const newTotalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    setActiveStartDate(newStartDate);
    setActiveEndDate(newEndDate);
    setActivePickUpLocation(tempPickUpLocation);
    setActiveDropOffLocation(tempDropOffLocation);
    setActiveTotalDays(newTotalDays);

    navigate(".", {
      replace: true,
      state: {
        ...locationState,
        startDate: newStartDate,
        endDate: newEndDate,
        pickUpLocation: tempPickUpLocation,
        dropOffLocation: tempDropOffLocation,
        totalDays: newTotalDays,
      },
    });

    setIsPoppedUp(false);
  };

  useEffect(() => {
    if (
      !activeStartDate ||
      !activeEndDate ||
      !activePickUpLocation ||
      !activeDropOffLocation
    ) {
      navigate("/");
      return;
    }

    api
      .get(
        `/cars/available?startDate=${activeStartDate}&endDate=${activeEndDate}&pickupLocationId=${activePickUpLocation}&returnLocationId=${activeDropOffLocation}`,
      )
      .then((res) => {
        setInitialCars(res.data.data);
        setCars(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [
    activeStartDate,
    activeEndDate,
    activePickUpLocation,
    activeDropOffLocation,
    navigate,
  ]);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => {
      if (filterKey === "maxPrice" || filterKey === "userAge") {
        return { ...prev, [filterKey]: Number(value) };
      }

      const currentList = prev[filterKey] || [];
      const isRemoving = currentList.includes(value);

      let newFilters = { ...prev };

      if (isRemoving) {
        newFilters[filterKey] = currentList.filter((item) => item !== value);
      } else {
        newFilters[filterKey] = [...currentList, value];
      }

      if (filterKey === "brand" || filterKey === "modelName") {
        const validModels =
          newFilters.brand.length > 0
            ? new Set(
                initialCars
                  .filter((c) => newFilters.brand.includes(c.brand))
                  .map((c) => c.modelName),
              )
            : new Set();

        newFilters.modelName = newFilters.modelName.filter((m) =>
          validModels.has(m),
        );

        const validTrims =
          newFilters.modelName.length > 0
            ? new Set(
                initialCars
                  .filter((c) => newFilters.modelName.includes(c.modelName))
                  .map((c) => c.trim),
              )
            : new Set();

        const validEngineSizes =
          newFilters.modelName.length > 0
            ? new Set(
                initialCars
                  .filter((c) => newFilters.modelName.includes(c.modelName))
                  .map((c) => c.engineSize),
              )
            : new Set();

        newFilters.trim = newFilters.trim.filter((t) => validTrims.has(t));
        newFilters.engineSize = newFilters.engineSize.filter((e) =>
          validEngineSizes.has(e),
        );
      }

      return newFilters;
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
    if (
      !activeStartDate ||
      !activeEndDate ||
      !activePickUpLocation ||
      !activeDropOffLocation
    )
      return;

    const queryParams = new URLSearchParams();
    queryParams.append("startDate", activeStartDate);
    queryParams.append("endDate", activeEndDate);
    queryParams.append("pickupLocationId", activePickUpLocation);
    queryParams.append("returnLocationId", activeDropOffLocation);
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
  }, [
    activeStartDate,
    activeEndDate,
    activePickUpLocation,
    activeDropOffLocation,
    debouncedFilters,
    currentPage,
  ]);

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

  const availableTrims =
    filters.modelName.length > 0
      ? [
          ...new Set(
            initialCars
              .filter((c) => filters.modelName.includes(c.modelName))
              .map((c) => c.trim)
              .filter(Boolean),
          ),
        ]
      : [];

  const availableEngineSizes =
    filters.modelName.length > 0
      ? [
          ...new Set(
            initialCars
              .filter((c) => filters.modelName.includes(c.modelName))
              .map((c) => c.engineSize)
              .filter(Boolean),
          ),
        ]
      : [];

  const baseFilteredCars = initialCars.filter((c) => {
    const matchBrand =
      filters.brand.length === 0 || filters.brand.includes(c.brand);
    const matchModel =
      filters.modelName.length === 0 || filters.modelName.includes(c.modelName);
    const matchTrim =
      filters.trim.length === 0 || filters.trim.includes(c.trim);
    const matchEngineSize =
      filters.engineSize.length === 0 ||
      filters.engineSize.includes(c.engineSize);
    return matchBrand && matchModel && matchTrim && matchEngineSize;
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
    <div className="flex gap-6 p-4 relative">
      <SearchSideBar
        t={t}
        filters={filters}
        brands={availableBrands}
        models={availableModels}
        trims={availableTrims}
        engineSizes={availableEngineSizes}
        colors={availableColors}
        bodyTypes={availableBodyTypes}
        doors={availableDoors}
        fuelTypes={availableFuelTypes}
        gearTypes={availableGearTypes}
        minAges={availableMinAges}
        onFilterChange={handleFilterChange}
        setIsPoppedUp={handleOpenPopUp}
      />

      <div className="flex-1 flex flex-col justify-between max-w-8/10 mx-auto ">
        <div>
          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Alış Tarihi
              </span>
              <span className="text-base font-semibold text-slate-700">
                {activeStartDate}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 rounded-full"></div>

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                İade Tarihi
              </span>
              <span className="text-base font-semibold text-slate-700">
                {activeEndDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cars.map((car) => (
              <CarCard
                key={car.car_id || car.id}
                car={car}
                t={t}
                totalDays={activeTotalDays}
                startDate={activeStartDate}
                endDate={activeEndDate}
                pickUpLocation={activePickUpLocation}
                dropOffLocation={activeDropOffLocation}
              />
            ))}
          </div>

          {cars.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              {t.noCarFound || "Araç bulunamadı."}
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
              ‹ {t.previousPage || "Önceki"}
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
              {t.nextPage || "Sonraki"} ›
            </button>
          </div>
        )}
      </div>

      {/* Güncellenmiş Pop-up */}
      {isPoppedUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <RentalDatePicker
              t={t}
              pickUpDate={tempPickUpDate}
              setPickUpDate={setTempPickUpDate}
              pickUpTime={tempPickUpTime}
              setPickUpTime={setTempPickUpTime}
              dropOffDate={tempDropOffDate}
              setDropOffDate={setTempDropOffDate}
              dropOffTime={tempDropOffTime}
              setDropOffTime={setTempDropOffTime}
              pickUpLocation={tempPickUpLocation}
              setPickUpLocation={setTempPickUpLocation}
              dropOffLocation={tempDropOffLocation}
              setDropOffLocation={setTempDropOffLocation}
            />

            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                onClick={() => setIsPoppedUp(false)}
              >
                İptal Et
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                onClick={handleConfirmDates}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
