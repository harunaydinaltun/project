import { useLocation, useNavigate } from "react-router-dom";
import CarSummary from "../components/checkoutcomponents/CarSummary";
import Payment from "../components/checkoutcomponents/Payment";

export const Checkoutpage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/");
  }

  const {
    car,
    startDate,
    endDate,
    pickUpLocation,
    dropOffLocation,
    daysDiff,
    totalPrice,
  } = location.state;

  return (
    <div className="flex mt-5">
      <CarSummary
        car={car}
        daysDiff={daysDiff}
        totalPrice={totalPrice}
      ></CarSummary>
      <Payment></Payment>
    </div>
  );
};

export default Checkoutpage;
