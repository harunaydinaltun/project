import { useCurrency } from "../../context/CurrencyContext";

export const ExtraDetails = ({ extra, onSelect, selectedExtras }) => {
  const { formatPrice } = useCurrency();
  return (
    <div
      className={`flex flex-col bg-slate-50 p-3 rounded-xl shadow-lg border-2 cursor-pointer  hover:shadow-xl duration-300 ${selectedExtras.some((item) => item.id === extra.id) ? `border-blue-500 scale-[1.02]` : `border-slate-300`} `}
      onClick={() => onSelect(extra)}
    >
      {" "}
      <h1 className="self-center text-xl font-semibold text-shadow-2xs border-b mt-3.5">
        {extra.name}
      </h1>
      <span className="self-center">
        {extra.isDaily ? (
          <p>
            <b>Günlük / </b>
            {formatPrice(Number(extra.price))}
          </p>
        ) : (
          <p>
            <b>Tek seferlik / </b> {formatPrice(Number(extra.price))}
          </p>
        )}
      </span>
      <span>{extra.description}</span>
      <button
        className={`text-white mt-auto rounded-2xl ring shadow-2xl duration-50 cursor-pointer ${selectedExtras.some((item) => item.id === extra.id) ? "bg-red-600  ring-red-700" : "bg-green-600 ring-green-700"}`}
      >
        {selectedExtras.some((item) => item.id === extra.id)
          ? "Kaldır"
          : "Ekle"}
      </button>
    </div>
  );
};

export default ExtraDetails;
