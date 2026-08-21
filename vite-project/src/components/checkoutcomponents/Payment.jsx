import Packet from "./paymentsteps/Packet";
import Extra from "./paymentsteps/Extra";
import Credit from "./paymentsteps/Credit";
import Confirm from "./paymentsteps/Confirm";

export const Payment = ({
  step,
  daysDiff,
  packets,
  extras,
  setSelectedPacket,
  selectedPacket,
  setSelectedExtras,
  selectedExtras,
  customerInfo,
  setCustomerInfo,
  cardInfo,
  setCardInfo,
  rentalId,
}) => {
  return (
    <div className="flex items-center justify-center max-w-9/10">
      {step === "packet" && (
        <Packet
          daysDiff={daysDiff}
          packets={packets}
          setSelectedPacket={setSelectedPacket}
          selectedPacket={selectedPacket}
        />
      )}
      {step === "extra" && (
        <Extra
          extras={extras}
          daysDiff={daysDiff}
          selectedExtras={selectedExtras}
          setSelectedExtras={setSelectedExtras}
        />
      )}
      {step === "credit" && (
        <Credit
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          cardInfo={cardInfo}
          setCardInfo={setCardInfo}
        />
      )}
      {step === "confirm" && <Confirm rentalId={rentalId} />}
    </div>
  );
};

export default Payment;
