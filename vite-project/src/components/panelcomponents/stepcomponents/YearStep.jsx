export const YearStep = ({
  brand,
  model,
  years,
  selectedYear,
  onYearChange,
  onNext,
  onBack,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rin ring-slate-100 rounded-lg bg-white shadow-xl">
      <h3 className="text-lg font-semibold text-slate-800">
        Adım 3: Yıl Seçiniz
      </h3>
      <span className="text-sm bg-blue-100 text-blue-800 p-1 rounded w-max">
        {brand} &gt; {model}
      </span>
      <select
        value={selectedYear}
        onChange={onYearChange}
        className="border p-2 rounded"
      >
        <option value="">-</option>
        {years.map((year, i) => (
          <option key={i} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white p-2 rounded cursor-pointer"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedYear || loading}
          className="flex-1 bg-blue-600 text-white p-2 rounded cursor-pointer disabled:cursor-default disabled:opacity-50"
        >
          İleri (Paketler)
        </button>
      </div>
    </div>
  );
};

export default YearStep;
