import { useEffect, useState } from "react";
import api from "../../utils/api";
import BrandStep from "./stepcomponents/BrandStep";
import ModelStep from "./stepcomponents/ModelStep";
import YearStep from "./stepcomponents/YearStep";
import VariantStep from "./stepcomponents/VariantStep";
import CarDetailsStep from "./stepcomponents/CarDetailsStep";
import LocationStep from "./stepcomponents/LocationStep";
import ConfirmModal from "./stepcomponents/ConfirmModal";

export const AdminAddCar = () => {
  const [page, setPage] = useState("brand");
  const [loading, setLoading] = useState(false);
  const [modelConfirmed, setModelConfirmed] = useState(false);

  const [brands, setBrands] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const [years, setYears] = useState([]);
  const [variants, setVariants] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [modelId, setModelId] = useState(null);
  const [locationId, setLocationId] = useState("");

  const [inputs, setInputs] = useState({
    licensePlate: "",
    dailyPrice: "",
    deposit: "",
    kilometer: "",
    color: "",
  });

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
    setSelectedYear("");
    setModelId(null);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedYear("");
    setModelId(null);
  };

  const handleInputsChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [brandsRes, locationsRes] = await Promise.all([
          api.get("/models/brands"),
          api.get("/locations"),
        ]);
        setBrands(brandsRes.data.data || []);
        setLocations(locationsRes.data.data || []);
      } catch (error) {
        console.error("Başlangıç verileri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (page === "model" && selectedBrand) {
      api
        .get(`/models/model-names?brand=${selectedBrand}`)
        .then((res) => setModelNames(res.data.data));
    }
  }, [page, selectedBrand]);

  useEffect(() => {
    if (page === "year" && selectedBrand && selectedModel) {
      api
        .get(`/models/years?brand=${selectedBrand}&modelName=${selectedModel}`)
        .then((res) => setYears(res.data.data));
    }
  }, [page, selectedBrand, selectedModel]);

  useEffect(() => {
    if (page === "variants" && selectedBrand && selectedModel && selectedYear) {
      api
        .get(
          `/models/selection?brand=${selectedBrand}&modelName=${selectedModel}&year=${selectedYear}`,
        )
        .then((res) => setVariants(res.data.data));
    }
  }, [page, selectedBrand, selectedModel, selectedYear]);

  const handleSubmitCar = async () => {
    if (!locationId) return alert("Şube seçimi zorunludur!");
    try {
      setLoading(true);
      await api.post("/cars", {
        modelId,
        locationId,
        licensePlate: inputs.licensePlate,
        color: inputs.color,
        dailyPrice: Number(inputs.dailyPrice),
        deposit: Number(inputs.deposit),
        kilometer: Number(inputs.kilometer),
      });

      alert("Araç başarıyla eklendi!");

      setPage("brand");
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedYear("");
      setModelId(null);
      setLocationId("");
      setInputs({
        licensePlate: "",
        dailyPrice: "",
        deposit: "",
        kilometer: "",
        color: "",
      });
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mt-8 mx-auto w-full">
      <h2 className="text-xl font-bold self-center text-gray-800">
        Fiziksel Araç Ekle
      </h2>

      {page === "brand" && (
        <BrandStep
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
          onNext={() => setPage("model")}
          loading={loading}
        />
      )}

      {page === "model" && (
        <ModelStep
          brand={selectedBrand}
          models={modelNames}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          onNext={() => setPage("year")}
          onBack={() => setPage("brand")}
          loading={loading}
        />
      )}

      {page === "year" && (
        <YearStep
          brand={selectedBrand}
          model={selectedModel}
          years={years}
          selectedYear={selectedYear}
          onYearChange={(e) => setSelectedYear(e.target.value)}
          onNext={() => setPage("variants")}
          onBack={() => setPage("model")}
          loading={loading}
        />
      )}

      {page === "variants" && (
        <VariantStep
          brand={selectedBrand}
          model={selectedModel}
          year={selectedYear}
          variants={variants}
          onSelectVariant={(id) => {
            setModelId(id);
            setModelConfirmed(true);
          }}
          onBack={() => setPage("year")}
        />
      )}

      {page === "cardetails" && (
        <CarDetailsStep
          inputs={inputs}
          handleInputsChange={handleInputsChange}
          onNext={() => setPage("location")}
          onBack={() => setPage("variants")}
        />
      )}

      {page === "location" && (
        <LocationStep
          locations={locations}
          locationId={locationId}
          setLocationId={setLocationId}
          onSubmit={handleSubmitCar}
          onBack={() => setPage("cardetails")}
          loading={loading}
        />
      )}

      {modelConfirmed && (
        <ConfirmModal
          brand={selectedBrand}
          model={selectedModel}
          year={selectedYear}
          variant={variants.find((v) => v.id === modelId)}
          onConfirm={() => {
            setPage("cardetails");
            setModelConfirmed(false);
          }}
          onCancel={() => setModelConfirmed(false)}
        />
      )}
    </div>
  );
};

export default AdminAddCar;
