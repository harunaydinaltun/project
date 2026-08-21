import { useLocations } from "../../../context/LocationContext";

export const LocationStep = ({
  locations,
  locationId,
  setLocationId,
  onSubmit,
  onBack,
  loading,
}) => {
  const { getLocationName } = useLocations();
  return (
    <div className="flex flex-col gap-3 p-4 ring ring-slate-100 rounded-lg bg-white shadow-xl">
      <h3 className="text-lg font-semibold text-slate-800">
        Adım 6: Şube Seçiniz
      </h3>
      <select
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
        className="border p-2 rounded bg-slate-100"
      >
        <option value="">-</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {getLocationName(loc.id)}
          </option>
        ))}
      </select>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white p-2 rounded cursor-pointer"
        >
          Geri
        </button>
        <button
          onClick={onSubmit}
          disabled={!locationId || loading}
          className="flex-1 bg-green-600 text-white p-2 rounded cursor-pointer disabled:cursor-default disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Aracı Kaydet"}
        </button>
      </div>
    </div>
  );
};
export default LocationStep;
