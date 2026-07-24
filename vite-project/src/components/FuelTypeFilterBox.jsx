import { useState } from "react";

export const FuelTypeFilterBox = ({
  t,
  fuelTypes = [],
  filters,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = filters?.fuelType;

  return (
    <div className="bg-slate-200 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300 max-w-40 cursor-pointer transition-all hover:shadow-lg">
      <div className="flex justify-evenly" onClick={() => setIsOpen(!isOpen)}>
        <div className="pl-1 text-shadow-md">{t.fuelType || "Fuel Type"}</div>
        <span
          className={`text-shadow-md text-xs transform duration-500 ${isOpen ? "rotate-x-180" : ""}`}
        >
          ▼
        </span>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 flex flex-col gap-1">
            {Array.isArray(fuelTypes) && fuelTypes.length > 0 ? (
              fuelTypes.map((item) => {
                const isSelected = selectedValue === item;
                return (
                  <div
                    key={item}
                    onClick={() => onFilterChange("fuelType", item)}
                    className={`text-shadow-md flex items-center p-1 gap-2 rounded cursor-pointer transition-colors hover:bg-slate-50 ${
                      isSelected
                        ? "bg-slate-50 ring-1 ring-slate-400 font-medium"
                        : ""
                    }`}
                  >
                    <span className="text-xs">{t.fuelConstants[item]}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-gray-500 pl-1">{t.noOptions}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelTypeFilterBox;
