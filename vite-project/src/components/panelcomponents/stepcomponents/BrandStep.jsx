export const BrandStep = ({
  brands,
  selectedBrand,
  onBrandChange,
  onNext,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 shadow-2xl rounded-xl bg-white ">
      <h3 className="text-lg font-semibold text-slate-800">
        Adım 1: Marka Seçiniz
      </h3>
      <select
        value={selectedBrand}
        onChange={onBrandChange}
        className="border p-2 rounded"
      >
        <option value="">-</option>
        {brands.map((brand, i) => (
          <option key={i} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      <button
        onClick={onNext}
        disabled={!selectedBrand || loading}
        className="bg-blue-600 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default"
      >
        İleri
      </button>
    </div>
  );
};

export default BrandStep;
