export const ModelStep = ({
  brand,
  models,
  selectedModel,
  onModelChange,
  onNext,
  onBack,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4  rounded-lg bg-white ring ring-slate-100 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-800">
        Adım 2: Model Seçiniz
      </h3>
      <span className="text-sm bg-blue-100 text-blue-800 p-1 rounded w-max">
        Marka: {brand}
      </span>
      <select
        value={selectedModel}
        onChange={onModelChange}
        className="border p-2 rounded"
      >
        <option value="">-</option>
        {models.map((model, i) => (
          <option key={i} value={model}>
            {model}
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
          disabled={!selectedModel || loading}
          className="flex-1 bg-blue-600 text-white p-2 rounded cursor-pointer disabled:cursor-default disabled:opacity-50"
        >
          İleri
        </button>
      </div>
    </div>
  );
};
export default ModelStep;
