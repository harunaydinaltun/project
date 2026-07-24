import { useState } from "react";

export const ModelFilterBox = ({ t, models = [], filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedBrand = filters?.brand;
  const selectedModel = filters?.modelName;

  const isDisabled = !selectedBrand;

  const handleToggle = () => {
    if (isDisabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-slate-200 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300 max-w-40 transition-all ${
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-lg"
      }`}
    >
      <div className="flex justify-evenly" onClick={handleToggle}>
        <div className="pl-1 text-shadow-md">{t.model || "MODEL"}</div>
        <span
          className={`text-shadow-md text-xs transform duration-500 ${
            isOpen && !isDisabled ? "rotate-x-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${
          isOpen && !isDisabled ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 flex flex-col gap-1">
            {Array.isArray(models) && models.length > 0 ? (
              models.map((model) => {
                const isSelected = selectedModel === model;

                return (
                  <div
                    key={model}
                    onClick={() => onFilterChange("modelName", model)}
                    className={`text-shadow-md flex items-center p-1 gap-2 rounded cursor-pointer transition-colors hover:bg-slate-50 ${
                      isSelected
                        ? "bg-slate-50 ring-1 ring-slate-400 font-medium"
                        : ""
                    }`}
                  >
                    <span className="text-xs">{model}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-gray-500 pl-1">
                {isDisabled ? "Önce marka seçiniz" : "Model bulunamadı"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelFilterBox;
