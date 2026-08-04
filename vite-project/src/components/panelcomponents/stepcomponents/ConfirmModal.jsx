export const ConfirmModal = ({
  variant,
  brand,
  model,
  year,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col bg-white w-fit h-fit rounded-xl p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">
          Seçilen Model Özeti
        </h2>
        <div className="flex flex-col gap-2 mb-6">
          <span>
            <b>Marka:</b> {brand}
          </span>
          <span>
            <b>Model:</b> {model}
          </span>
          <span>
            <b>Yıl:</b> {year}
          </span>
          <span>
            <b>Paket:</b> {variant?.trim}
          </span>
          <span>
            <b>Motor:</b> {variant?.engineSize}
          </span>
          <span>
            <b>Yakıt:</b> {variant?.fuelType}
          </span>
          <span>
            <b>Şanzıman:</b> {variant?.gearType}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-red-500 text-white p-2 rounded"
          >
            Değiştir
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white p-2 rounded"
          >
            Onayla ve Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
