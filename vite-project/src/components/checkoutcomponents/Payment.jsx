import { useState } from "react";
import Packet from "./paymentsteps/Packet";
import Extra from "./paymentsteps/Extra";
import Credit from "./paymentsteps/Credit";

export const Payment = () => {
  const [step, setStep] = useState("credit");
  return (
    <div>
      {step === "packet" && <Packet setStep={setStep} />}
      {step === "extra" && <Extra setStep={setStep} />}
      {step === "credit" && <Credit setStep={setStep} />}
    </div>
  );
};

export default Payment;
