import valid from "card-validator";
export const validateTCNO = (tcno) => {
  if (!tcno) return "";
  if (tcno.length !== 11) return "TCNO 11 haneli olmalıdır.";
  if (tcno[0] === "0") return "TCNO 0 ile başlayamaz.";

  let oddSum = 0,
    evenSum = 0,
    sum = 0;
  for (let i = 0; i <= 9; i++) {
    if (i !== 9) {
      i % 2 === 0
        ? (oddSum += Number(tcno[i] * 7))
        : (evenSum += Number(tcno[i]));
    }
    sum += Number(tcno[i]);
  }
  if (tcno[9] != (oddSum - evenSum) % 10) return "Geçersiz TCNO";
  if (sum % 10 != tcno[10]) return "Geçersiz TCNO";

  return "";
};

export const validateName = (name) => {
  if (!name) return "";
  const regex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
  if (!regex.test(name)) return "Sadece harf giriniz.";
  if (name.length < 2) return "En az 2 karakter olmalıdır.";
  return "";
};

export const validatePhone = (phone) => {
  if (!phone) return "";
  const cleanPhone = phone.replace(/\s+/g, "");
  const regex = /^(05|5)\d{9}$/;
  if (!regex.test(cleanPhone))
    return "Geçerli bir numara giriniz (Örn: 05XX...)";
  return "";
};

export const validateCardNumber = (number) => {
  const numberValidation = valid.number(number);

  return {
    isValid: numberValidation.isValid,
    brand: numberValidation.card ? numberValidation.card.niceType : "",
    cvvMaxLength: numberValidation.card ? numberValidation.card.code.size : 3,
    error:
      number.length > 14 && !numberValidation.isValid
        ? "Geçersiz kart numarası"
        : "",
  };
};

export const validateCardDate = (date) => {
  if (date.length < 5) return "";
  const dateValidation = valid.expirationDate(date);
  return dateValidation.isValid ? "" : "Geçersiz veya geçmiş tarih";
};

export const validateCardCvv = (cvv, expectedLength) => {
  if (!cvv) return "";
  const cvvValidation = valid.cvv(cvv, expectedLength);
  return !cvvValidation.isValid && cvv.length === expectedLength
    ? "Geçersiz CVV"
    : "";
};
