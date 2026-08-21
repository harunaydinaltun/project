import { useLocation, useNavigate } from "react-router-dom";
import CarSummary from "../components/checkoutcomponents/CarSummary";
import Payment from "../components/checkoutcomponents/Payment";
import ProgressBar from "../components/checkoutcomponents/ProgressBar";
import { useState, useEffect } from "react";
import PaymentSummary from "../components/checkoutcomponents/PaymentSummary";
import api from "../utils/api";
import CheckOutErrorModal from "../components/checkoutcomponents/CheckOutErrorModal";
import { creditCardSchema } from "../validations/PaymentValidations";

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState("");
  const [step, setStep] = useState("packet");
  const [packets, setPackets] = useState([]);
  const [selectedPacket, setSelectedPacket] = useState("");
  const [extras, setExtras] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [checkOutError, setCheckOutError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    tcno: "",
    name: "",
    surname: "",
    phone: "",
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expireDate: "",
    cvv: "",
    cardOwner: "",
  });
  const [rentalId, setRentalId] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [packetsRes, extrasRes] = await Promise.all([
          api.get("/packets"),
          api.get("/extras"),
        ]);
        setPackets(packetsRes.data.data || []);
        setExtras(extrasRes.data.data || []);
        setSelectedPacket(packetsRes.data.data[0]);
      } catch (error) {
        console.error("Başlangıç verileri hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (!location.state) {
    navigate("/");
    return null;
  }

  const { car, startDate, endDate, pickUpLocation, dropOffLocation, daysDiff } =
    location.state;

  const handleContinue = async () => {
    if (step === "packet") return setStep("extra");
    if (step === "extra") return setStep("credit");
    if (step === "credit") {
      const validationResult = creditCardSchema.safeParse({
        ...customerInfo,
        ...cardInfo,
      });

      if (!validationResult.success) {
        alert("Lütfen ilk önce hatalı ve eksik alanları düzeltin");
        return;
      }
      const validData = validationResult.data;
      const payload = {
        car_id: car.car_id,
        start_date: startDate,
        end_date: endDate,
        pickup_location_id: pickUpLocation,
        return_location_id: dropOffLocation,
        packet_id: selectedPacket.id,
        extras: selectedExtras.map((ex) => ({ id: ex.id, price: ex.price })),
        totalPrice: grandTotal,
        cardDetails: {
          cardNumber: validData.cardNumber,
          expireDate: validData.expireDate,
          cvv: cardInfo.cvv,
          cardOwner: validData.cardOwner,
        },
      };

      try {
        setLoading(true);
        const response = await api.post("/payment", payload);
        setRentalId(response.data.rental_id);
        setStep("confirm");
      } catch (error) {
        console.error("Ödeme hatası:", error);
        setCheckOutError(error.response?.data?.message || "Bir hata oluştu");
        alert(error.response?.data?.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === "extra") return setStep("packet");
    if (step === "credit") return setStep("extra");
    if (step === "confirm") return setStep("credit");
  };
  const extrasTotalPrice =
    selectedExtras?.reduce((total, extra) => {
      if (extra.isDaily) {
        return total + Number(extra.price) * daysDiff;
      } else {
        return total + Number(extra.price);
      }
    }, 0) || 0;

  const grandTotal =
    (Number(car.dailyPrice) + Number(selectedPacket?.price || 0)) * daysDiff +
    Number(car.deposit) +
    extrasTotalPrice;

  return (
    <div className="flex flex-col md:flex-row mt-5 p-4 w-full mx-auto">
      <div className="w-full md:w-1/4 lg:w-1/4 shrink-0 p-3">
        <CarSummary car={car} />
        <PaymentSummary
          daysDiff={daysDiff}
          startDate={startDate}
          endDate={endDate}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          dailyPrice={car.dailyPrice}
          deposit={car.deposit}
          selectedPacket={selectedPacket}
          selectedExtras={selectedExtras}
          grandTotal={grandTotal}
        />
      </div>
      <div className="w-full md:w-3/4 flex flex-col items-center md:mt-0 p-3">
        <ProgressBar step={step} />
        <div className="w-full min-h-112.5 flex justify-center ">
          <Payment
            step={step}
            daysDiff={daysDiff}
            packets={packets}
            extras={extras}
            setSelectedPacket={setSelectedPacket}
            selectedPacket={selectedPacket}
            setSelectedExtras={setSelectedExtras}
            selectedExtras={selectedExtras}
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            cardInfo={cardInfo}
            setCardInfo={setCardInfo}
            rentalId={rentalId}
          />
        </div>

        {step === "confirm" ? (
          ""
        ) : (
          <div className="flex gap-x-3 w-full md:w-1/2 mt-8">
            <button
              className={`flex-1 bg-slate-500 h-11 rounded-lg text-white font-medium duration-300 active:scale-[0.99] ${
                step === "packet"
                  ? "opacity-25 cursor-not-allowed"
                  : "hover:bg-slate-600 cursor-pointer"
              }`}
              onClick={handleBack}
              disabled={loading || step === "packet"}
            >
              Geri
            </button>
            <button
              className="flex-1 bg-green-600 h-11 rounded-lg text-white font-medium cursor-pointer hover:bg-green-700 duration-300 active:scale-[0.99]"
              onClick={handleContinue}
              disabled={loading}
            >
              Devam
            </button>
          </div>
        )}
        {checkOutError && <CheckOutErrorModal checkOutError={checkOutError} />}
      </div>
    </div>
  );
};

export default CheckoutPage;
