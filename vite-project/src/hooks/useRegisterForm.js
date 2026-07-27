import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useRegisterForm = (t) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    birthdate: "",
    tel_no: "",
  });

  const [err, setErr] = useState(null);

  const [errors, setErrors] = useState({
    username: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
    tel_no: "",
  });

  const [passwordConditions, setPasswordConditions] = useState({
    lowerCase: false,
    upperCase: false,
    number: false,
    length: false,
    special: false,
    noSpaces: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "tel_no") {
      const cleanTelNo = value.replace(/\s+/g, "");

      if (!value) {
        setErrors((prev) => ({ ...prev, tel_no: "" }));
      } else if (cleanTelNo.length >= 2 && !cleanTelNo.startsWith("05")) {
        setErrors((prev) => ({
          ...prev,
          tel_no: t.telnoError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, tel_no: "" }));
      }
    }

    if (name === "name") {
      if (/[!-/]+/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          name: t.nameError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }

    if (name === "surname") {
      if (/[!-/]+/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          surname: t.surnameError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, surname: "" }));
      }
    }

    if (name === "birthdate") {
      const birthDate = new Date(value);
      const todayDate = new Date();

      let age = todayDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = todayDate.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && todayDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        setErrors((prev) => ({
          ...prev,
          birthdate: t.ageError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, birthdate: "" }));
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        setErrors((prev) => ({ ...prev, email: "" }));
      } else if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: t.emailError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "username") {
      if (/[!-/]+/.test(value) || (value.length > 0 && /\s/.test(value))) {
        setErrors((prev) => ({
          ...prev,
          username: t.usernameError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, username: "" }));
      }
    }

    if (name === "password") {
      setPasswordConditions({
        length: value.length >= 6,
        lowerCase: /[a-zçğıöşü]+/.test(value),
        upperCase: /[A-ZÇĞİÖŞÜ]+/.test(value),
        number: /[0-9]+/.test(value),
        special: /[!-/]+/.test(value),
        noSpaces: value.length > 0 && !/\s/.test(value),
      });

      if (
        value.length < 6 ||
        !/[a-zçğıöşü]+/.test(value) ||
        !/[A-ZÇĞİÖŞÜ]+/.test(value) ||
        !/[0-9]+/.test(value) ||
        !/[!-/]+/.test(value) ||
        /\s/.test(value)
      ) {
        setErrors((prev) => ({
          ...prev,
          password: t.passwordConditionsError,
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "password" || name === "confirmPassword") {
      const passwordToCompare = name === "password" ? value : inputs.password;
      const confirmToCompare =
        name === "confirmPassword" ? value : inputs.confirmPassword;

      if (confirmToCompare && confirmToCompare !== passwordToCompare) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: t.passwordsDontMatch,
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr(null);

    const hasValidationErrors = Object.values(errors).some(
      (error) => error !== "",
    );
    if (hasValidationErrors) {
      return setErr(t.fieldError);
    }

    const hasEmptyFields = Object.values(inputs).some((value) => value === "");
    if (hasEmptyFields) {
      return setErr(t.emptyFieldError);
    }

    const formattedInputs = {
      ...inputs,
      name: inputs.name.trim(),
      surname: inputs.surname.trim(),
      username: inputs.username.trim(),
      email: inputs.email.trim(),
      tel_no: inputs.tel_no.replace(/\s+/g, ""),
    };

    try {
      await axios.post(
        "http://localhost:8800/api/auth/register",
        formattedInputs,
      );
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
