import { useLocation, useNavigate } from "react-router-dom";
import CarSummary from "../components/checkoutcomponents/CarSummary";
import Payment from "../components/checkoutcomponents/Payment";
import ProgressBar from "../components/checkoutcomponents/ProgressBar";
import { useState, useEffect } from "react";
import PaymentSummary from "../components/checkoutcomponents/PaymentSummary";
import api from "../utils/api";
import {
  validateTCNO,
  validateName,
  validatePhone,
  validateCardNumber,
  validateCardDate,
  validateCardCvv,
} from "../utils/checkoutvalidations";
import CheckOutErrorModal from "../components/checkoutcomponents/CheckOutErrorModal";

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
      const idError = validateTCNO(customerInfo.tcno);
      const nameError = validateName(customerInfo.name);
      const surnameError = validateName(customerInfo.surname);
      const phoneError = validatePhone(customerInfo.phone);

      const cardValidation = validateCardNumber(cardInfo.cardNumber);
      const dateError = validateCardDate(cardInfo.expireDate);
      const cvvError = validateCardCvv(cardInfo.cvv);
      const ownerError = cardInfo.cardOwner.length < 3 ? "İsim çok kısa" : "";

      if (
        idError ||
        nameError ||
        surnameError ||
        phoneError ||
        cardValidation.error ||
        dateError ||
        cvvError ||
        ownerError
      ) {
        alert("Lütfen ilk önce hatalı ve eksik alanları düzeltin");
        return;
      }

      const payload = {
        car_id: car.car_id,
        start_date: startDate,
        end_date: endDate,
        pickup_location_id: pickUpLocation,
        return_location_id: dropOffLocation,
        packet_id: selectedPacket.id,
        extras: selectedExtras.map((ex) => ({ id: ex.id, price: ex.price })),
        totalPrice: grandTotal,
        cardDetails: cardInfo,
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
    <div className="flex flex-col md:flex-row mt-5 p-4 w-screen mx-auto">
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

      <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col mx-auto md:mt-0 p-3">
        <ProgressBar step={step} />
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

        {step === "confirm" ? (
          ""
        ) : (
          <div className="flex gap-x-3">
            {" "}
            <button
              className={`bg-slate-500 min-w-1/2 mt-5 h-10 rounded-lg text-white duration-300 active:scale-[0.99] ${step === "packet" ? "opacity-25 disabled" : "hover:bg-slate-600 cursor-pointer"}`}
              onClick={handleBack}
              disabled={loading}
            >
              Geri
            </button>
            <button
              className="bg-green-600 min-w-1/2 mt-5 h-10 rounded-lg text-white cursor-pointer hover:bg-green-700 duration-300 active:scale-[0.99]"
              onClick={handleContinue}
              disabled={loading}
            >
              Devam
            </button>
          </div>
        )}
        {checkOutError ? (
          <CheckOutErrorModal checkOutError={checkOutError} />
        ) : (
          ""
        )}
      </div>
      <div className="hidden md:block md:w-1/4 lg:w-1/4 pointer-events-none"></div>
    </div>
  );
};

export default CheckoutPage;
