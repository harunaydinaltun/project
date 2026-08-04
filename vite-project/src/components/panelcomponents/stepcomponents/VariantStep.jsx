export const VariantStep = ({
  brand,
  model,
  year,
  variants,
  onSelectVariant,
  onBack,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold">
        Adım 4: Donanım Paketini Seçiniz
      </h3>
      <span className="text-sm bg-blue-100 text-blue-800 p-1 rounded w-max">
        {brand} &gt; {model} &gt; {year}
      </span>
      <div className="border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b">Paket</th>
              <th className="p-2 border-b">Motor</th>
              <th className="p-2 border-b">Yakıt</th>
              <th className="p-2 border-b">Seç</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="hover:bg-blue-50 duration-200">
                <td className="p-2 border-b">{v.trim}</td>
                <td className="p-2 border-b">{v.engineSize}</td>
                <td className="p-2 border-b">{v.fuelType}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => onSelectVariant(v.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Seç
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={onBack}
        className="w-full bg-gray-500 text-white p-2 rounded mt-2"
      >
        Geri Dön
      </button>
    </div>
  );
};

export default VariantStep;
