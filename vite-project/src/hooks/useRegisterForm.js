import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { registerSchema } from "../validations/AuthValidations";

export const useRegisterForm = (t) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    birthdate: "",
    tel_no: "",
  });

  const [err, setErr] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordConditions, setPasswordConditions] = useState({
    lowerCase: false,
    upperCase: false,
    number: false,
    length: false,
    special: false,
    noSpaces: false,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "tel_no") {
      value = value.replace(/\s+/g, "");
    }

    const newInputs = { ...inputs, [name]: value };
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

    const result = registerSchema.safeParse(newInputs);

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
      setErrors({});
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr(null);

    const result = registerSchema.safeParse(inputs);

    if (!result.success) {
      const formattedErrorsData = result.error.format();
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
      return setErr(t.fieldError);
    }

    const formattedInputs = result.data;

    delete formattedInputs.confirmPassword;

    try {
      await api.post("/auth/register", formattedInputs);
      navigate("/login");
    } catch (error) {
      setErr(t.registrationError);
      console.log(error.message);
    }
  };

  return {
    inputs,
    errors,
    passwordConditions,
    err,
    today,
    handleChange,
    handleRegister,
    navigate,
  };
};
