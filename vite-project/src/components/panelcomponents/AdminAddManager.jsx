import { CustomInput } from "../CustomInput";
import { PasswordConditions } from "../../components/PasswordConditions";
import { useLocations } from "../../context/LocationContext";
import { useManagerRegisterForm } from "../../hooks/useManagerRegisterForm";

export const AdminAddManager = () => {
  const { locations } = useLocations();
  const {
    inputs,
    errors,
    passwordConditions,
    loading,
    message,
    err,
    handleChange,
    handleManagerRegister,
  } = useManagerRegisterForm();

  const dummyT = {
    passwordMatch: "Şifreler eşleşiyor",
    passwordMismatch: "Şifreler eşleşmiyor",
  };

  return (
    <div className="flex flex-col w-full max-w-xl bg-white p-6 rounded-2xl shadow-xl mt-5 mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Yönetici Ekle
      </h2>

      <form onSubmit={handleManagerRegister} className="flex flex-col gap-4">
        <CustomInput
          label="Ad"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Ad"
          required
        />

        <CustomInput
          label="Soyad"
          name="surname"
          value={inputs.surname}
          onChange={handleChange}
          error={errors.surname}
          placeholder="Soyad"
          required
        />

        <CustomInput
          label="E-posta"
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="E-posta adresi"
          required
        />

        <CustomInput
          label="Telefon Numarası"
          name="tel_no"
          value={inputs.tel_no}
          onChange={handleChange}
          error={errors.tel_no}
          placeholder="05XXXXXXXXX"
          required
        />

        <CustomInput
          label="Doğum Tarihi"
          type="date"
          name="birthdate"
          value={inputs.birthdate}
          onChange={handleChange}
          error={errors.birthdate}
          required
        />

        <CustomInput
          label="İşe Giriş Tarihi"
          type="date"
          name="hire_date"
          value={inputs.hire_date}
          onChange={handleChange}
          error={errors.hire_date}
          required
        />

        <CustomInput
          label="Departman"
          name="department"
          value={inputs.department}
          onChange={handleChange}
          error={errors.department}
          placeholder="Departman adı"
          required
        />
        <div className="flex flex-col">
          <CustomInput
            label="Şifre"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            maxLength={64}
            required
          />
          <PasswordConditions
            conditions={passwordConditions}
            errors={errors}
            t={dummyT}
          />
        </div>

        <CustomInput
          label="Şifre Tekrar"
          type="password"
          name="confirmPassword"
          value={inputs.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          maxLength={64}
          required
        />
        <div className="flex flex-col">
          <label className="text-sm font-medium text-slate-700 mb-1">
            Şube
          </label>
          <select
            name="location_id"
            value={inputs.location_id}
            onChange={handleChange}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            required
          >
            <option value="" disabled>
              Şube Seçiniz
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locationName}
              </option>
            ))}
          </select>
          {errors.location_id && (
            <span className="text-red-500 text-xs mt-1">
              {errors.location_id}
            </span>
          )}
        </div>

        {err && (
          <p className="text-red-600 text-sm font-medium text-center">{err}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm font-medium text-center">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-all text-base mt-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Yöneticiyi Kaydet"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddManager;
