import logo from "../assets/placeholders/logo_transparent.png";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { CustomInput } from "../components/CustomInput";
import { PasswordConditions } from "../components/PasswordConditions";

export const RegisterPage = ({ t }) => {
  const {
    inputs,
    errors,
    passwordConditions,
    err,
    today,
    handleChange,
    handleRegister,
    navigate,
  } = useRegisterForm(t);

  return (
    <div className="min-h-screen flex justify-center items-center mt-5">
      <form
        onSubmit={handleRegister}
        className="grid grid-cols-1 w-full min-w-120 max-w-130 justify-center items-center bg-slate-50 rounded-2xl shadow-2xl gap-y-3 p-6"
      >
        <img
          className="max-w-48 place-self-center mb-2"
          src={logo}
          alt="Logo"
        />

        <div className="flex justify-between gap-3">
          <CustomInput
            label={t.name}
            name="name"
            value={inputs.name}
            onChange={handleChange}
            error={errors.name}
            maxLength={45}
          />
          <CustomInput
            label={t.surname}
            name="surname"
            value={inputs.surname}
            onChange={handleChange}
            error={errors.surname}
            maxLength={45}
          />
        </div>

        <CustomInput
          label={t.yourBirthdate}
          type="date"
          name="birthdate"
          value={inputs.birthdate}
          max={today}
          onChange={handleChange}
          error={errors.birthdate}
        />

        <CustomInput
          label={t.email}
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          error={errors.email}
          maxLength={255}
        />
        <CustomInput
          label={t.telNo}
          type="tel"
          name="tel_no"
          value={inputs.tel_no}
          placeholder="05xx xxx xx xx"
          onChange={handleChange}
          error={errors.tel_no}
        />

        <div className="flex flex-col">
          <CustomInput
            label={t.password}
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            maxLength={64}
          />
          <PasswordConditions
            conditions={passwordConditions}
            errors={errors}
            t={t}
          />
        </div>

        <CustomInput
          label={t.confirmYourPassword}
          type="password"
          name="confirmPassword"
          value={inputs.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          maxLength={64}
        />

        <button
          type="submit"
          className="place-self-center bg-blue-500 text-slate-200 ring-1 ring-blue-400 shadow-xs hover:cursor-pointer text-shadow-sm rounded-sm w-1/2 mt-2 p-2.5 transition-all duration-75 hover:scale-[0.99]"
        >
          {t.register}
        </button>

        {err && (
          <p className="text-sm text-red-600 text-center font-semibold">
            {err}
          </p>
        )}

        <div className="text-[11px] text-center mt-2">
          <span className="text-slate-600">{t.haveAccount} </span>
          <span
            className="text-blue-600 font-semibold hover:cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            {t.loginPage}
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
