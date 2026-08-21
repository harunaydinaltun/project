import { useLocations } from "../../context/LocationContext";
import { useCurrency } from "../../context/CurrencyContext";
export const PaymentSummary = ({
  daysDiff,
  dailyPrice,
  startDate,
  endDate,
  deposit,
  pickUpLocation,
  dropOffLocation,
  selectedPacket,
  selectedExtras,
  grandTotal,
}) => {
  const { getLocationName } = useLocations();
  const { formatPrice } = useCurrency();
  return (
    <div className="flex flex-col p-2 justify-center items-center bg-slate-50 rounded-2xl mt-2">
      <span className="text-2xl border-b">Payment Summary</span>
      <div className="w-full ml-13 flex flex-col">
        <span>
          <b>Başlangıç Tarihi: </b> {startDate.replace("T", " ")}
        </span>
        <span>
          <b>Alış Noktası: </b> {getLocationName(pickUpLocation)}{" "}
        </span>
        <span>
          <b>Teslim Tarihi: </b> {endDate.replace("T", " ")}
        </span>
        <span>
          <b>Teslim Noktası: </b> {getLocationName(dropOffLocation)}{" "}
        </span>
        <span>
          <b>Günlük Ücret: </b> {formatPrice(dailyPrice)}
        </span>
        <span>
          <b>Seçili Paket: </b> {selectedPacket.name}{" "}
          {formatPrice(daysDiff * selectedPacket.price)}
        </span>
        <span className="flex flex-col gap-1">
          <b>Extralar: </b>
          {selectedExtras && selectedExtras.length > 0 ? (
            <ul className="text-sm text-gray-700 ml-2">
              {selectedExtras.map((extra) => (
                <li key={extra.id}>
                  - {extra.name} (
                  {extra.isDaily
                    ? `${formatPrice(Number(extra.price))}  / Günlük`
                    : `${formatPrice(Number(extra.price))}  / Tek seferlik`}
                  )
                </li>
              ))}
            </ul>
          ) : (
            <span className="ml-2">-</span>
          )}
        </span>
        <span>
          <b>*TOPLAM: </b> {formatPrice(grandTotal)}{" "}
        </span>
        <span className="text-xs text-slate-500">
          *{formatPrice(deposit)} Depozito Geri İade Edilir
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
