import { CAR_COLORS } from "../../../constants/carConstants";
export const CarDetailsStep = ({
  inputs,
  handleInputsChange,
  onNext,
  onBack,
}) => {
  const isFormValid = inputs.licensePlate && inputs.dailyPrice && inputs.color;
  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Adım 5: Araç Detayları</h3>
      <form className="flex flex-col gap-2">
        <input
          className="bg-slate-100 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          type="text"
          placeholder="Plaka (Örn: 34ABC123)"
          name="licensePlate"
          value={inputs.licensePlate}
          onChange={handleInputsChange}
        />
        <input
          className="bg-slate-100 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          type="number"
          placeholder="Günlük Fiyat"
          name="dailyPrice"
          value={inputs.dailyPrice}
          onChange={handleInputsChange}
        />
        <input
          className="bg-slate-100 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          type="number"
          placeholder="Depozito Ücreti"
          name="deposit"
          value={inputs.deposit}
          onChange={handleInputsChange}
        />
        <input
          className="bg-slate-100 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          type="number"
          placeholder="Mevcut Kilometre"
          name="kilometer"
          value={inputs.kilometer}
          onChange={handleInputsChange}
        />
        <select
          className="bg-slate-100 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          name="color"
          value={inputs.color}
          onChange={handleInputsChange}
        >
          <option value="">-- Renk Seçiniz --</option>
          {CAR_COLORS.map((c, index) => (
            <option key={index} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </form>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white p-2 rounded"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="flex-1 bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          İleri (Lokasyon)
        </button>
      </div>
    </div>
  );
};

export default CarDetailsStep;
