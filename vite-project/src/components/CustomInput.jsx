export const CustomInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  max,
  maxLength,
}) => {
  return (
    <div className="flex flex-col max-w-full min-w-1/2">
      <span className="text-xs text-slate-500 font-semibold mb-1">{label}</span>
      <input
        className="bg-slate-200 rounded-sm p-1 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        max={max}
        maxLength={maxLength}
      />
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          error
            ? "grid-rows-[1fr] opacity-100 mt-1"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[10px] text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomInput;
