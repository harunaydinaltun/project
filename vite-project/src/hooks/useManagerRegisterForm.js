import { useState } from "react";
import api from "../utils/api";
import { managerRegisterSchema } from "../validations/AuthValidations";

export const useManagerRegisterForm = () => {
  const [inputs, setInputs] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    tel_no: "",
    birthdate: "",
    location_id: "",
    department: "",
    hire_date: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [err, setErr] = useState(null);

  const [passwordConditions, setPasswordConditions] = useState({
    lowerCase: false,
    upperCase: false,
    number: false,
    length: false,
    special: false,
    noSpaces: false,
  });

  const handleChange = (e) => {
    let { name, value, type } = e.target;

    if (name === "tel_no") {
      value = value.replace(/\s+/g, "");
    }

    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    const newInputs = { ...inputs, [name]: finalValue };
    setInputs(newInputs);

    if (name === "password") {
      setPasswordConditions({
        length: value.length >= 6,
        lowerCase: /[a-zçğıöşü]+/.test(value),
        upperCase: /[A-ZÇĞİÖŞÜ]+/.test(value),
        number: /[0-9]+/.test(value),
        special: /[!-/]+/.test(value),
        noSpaces: value.length > 0 && !/\s/.test(value),
      });
    }

    const result = managerRegisterSchema.safeParse(newInputs);

    if (!result.success) {
      const formattedErrors = result.error.format();

      setErrors((prev) => ({
        ...prev,
        [name]: formattedErrors[name]?._errors[0] || "",
        ...(name === "password" && {
          confirmPassword: formattedErrors.confirmPassword?._errors[0] || "",
        }),
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleManagerRegister = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);

    const validationResult = managerRegisterSchema.safeParse(inputs);

    if (!validationResult.success) {
      const formattedErrorsData = validationResult.error.format();
      const formattedErrors = {};

      Object.keys(inputs).forEach((key) => {
        if (formattedErrorsData[key]?._errors?.[0]) {
          formattedErrors[key] = formattedErrorsData[key]._errors[0];
        }
      });

      if (formattedErrorsData._errors?.[0]) {
        formattedErrors.confirmPassword = formattedErrorsData._errors[0];
      }

      setErrors(formattedErrors);
      setErr("Lütfen formdaki hataları düzeltiniz.");
      return;
    }

    // Backend'e gönderirken confirmPassword alanını çıkarıyoruz
    const { confirmPassword, ...dataToSend } = validationResult.data;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.post("/auth/manager-register", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);
      setErrors({});
      setInputs({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        tel_no: "",
        birthdate: "",
        location_id: "",
        department: "",
        hire_date: "",
      });
      setPasswordConditions({
        lowerCase: false,
        upperCase: false,
        number: false,
        length: false,
        special: false,
        noSpaces: false,
      });
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          "Yönetici kaydedilirken bir hata oluştu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    inputs,
    errors,
    passwordConditions,
    loading,
    message,
    err,
    handleChange,
    handleManagerRegister,
  };
};
