import { useState } from "react";
import { CustomInput } from "../../CustomInput";
import {
  validateTCNO,
  validateName,
  validatePhone,
  validateCardNumber,
  validateCardDate,
  validateCardCvv,
} from "../../../utils/checkoutvalidations";

export const Credit = ({
  customerInfo,
  setCustomerInfo,
  cardInfo,
  setCardInfo,
}) => {
  const [idError, setIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [cardError, setCardError] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [dateError, setDateError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [cvvMaxLength, setCvvMaxLength] = useState(3);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdBlur = (e) => setIdError(validateTCNO(e.target.value));
  const handleNameBlur = (e) => setNameError(validateName(e.target.value));
  const handleSurnameBlur = (e) =>
    setSurnameError(validateName(e.target.value));
  const handlePhoneBlur = (e) => setPhoneError(validatePhone(e.target.value));

  const handleCreditChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCardInfo((prev) => ({ ...prev, cardNumber: val }));

    const { isValid, brand, cvvMaxLength, error } = validateCardNumber(val);
    setIsValid(isValid);
    setCardBrand(brand);
    setCvvMaxLength(cvvMaxLength);
    setCardError(error);
  };

  const handleDateChange = (e) => {
    let val = e.target.value.replace(/[^0-9/]/g, "");
    if (val.length === 2 && !val.includes("/")) val = val + "/";

    setCardInfo((prev) => ({ ...prev, expireDate: val }));
    setDateError(validateCardDate(val));
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCardInfo((prev) => ({ ...prev, cvv: val }));
    setCvvError(validateCardCvv(val, cvvMaxLength));
  };

  const handleCardOwnerChange = (e) => {
    setCardInfo((prev) => ({ ...prev, cardOwner: e.target.value }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="bg-slate-50 border p-5 flex flex-col gap-2 w-full lg:w-1/2 rounded-xl">
        <h1 className="font-bold text-slate-700 mb-2 border-b pb-2">
          KİMLİK BİLGİLERİ
        </h1>

        <CustomInput
          label="Kimlik Numarası"
          name="tcno"
          type="text"
          maxLength="11"
          value={customerInfo.tcno}
          onChange={handleCustomerChange}
          onBlur={handleIdBlur}
          error={idError}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <CustomInput
            label="İsim"
            name="name"
            value={customerInfo.name}
            onChange={handleCustomerChange}
            onBlur={handleNameBlur}
            error={nameError}
          />
          <CustomInput
            label="Soyisim"
            name="surname"
            value={customerInfo.surname}
            onChange={handleCustomerChange}
            onBlur={handleSurnameBlur}
            error={surnameError}
          />
        </div>
        <CustomInput
          label="Telefon Numarası"
          name="phone"
          value={customerInfo.phone}
          onChange={handleCustomerChange}
          placeholder="05..."
          maxLength="11"
          onBlur={handlePhoneBlur}
          error={phoneError}
        />
      </div>

      <div className="bg-slate-50 border p-5 flex flex-col gap-2 w-full lg:w-1/2 rounded-xl">
        <h1 className="font-bold text-slate-700 mb-2 border-b pb-2">
          ÖDEME BİLGİLERİ
        </h1>

        <div className="relative">
          <CustomInput
            label="Kredi Kartı Numarası"
            name="creditno"
            value={cardInfo.cardNumber}
            onChange={handleCreditChange}
            error={cardError}
          />
          {cardBrand && (
            <span
              className={`absolute right-2 top-6 text-[10px] font-bold px-2 py-1 rounded ${isValid ? "text-green-800 bg-green-100" : "text-blue-800 bg-blue-100"}`}
            >
              {cardBrand}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <CustomInput
            label="Son Kullanma Tarihi"
            name="date"
            placeholder="AA/YY"
            value={cardInfo.expireDate}
            onChange={handleDateChange}
            maxLength="5"
            error={dateError}
          />
          <CustomInput
            label="CVV"
            name="cvv"
            value={cardInfo.cvv}
            onChange={handleCvvChange}
            maxLength={cvvMaxLength}
            error={cvvError}
          />
        </div>
        <CustomInput
          label="Kart Üzerindeki İsim"
          name="cardowner"
          value={cardInfo.cardOwner}
          onChange={handleCardOwnerChange}
        />
      </div>
    </div>
  );
};

export default Credit;
