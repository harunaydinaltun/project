import { useState } from "react";

export const BrandFilterBox = ({ t, brands = [], filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBrand = filters?.brand;

  return (
    <div className="bg-slate-200 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300 max-w-40 cursor-pointer transition-all hover:shadow-lg">
      <div className="flex justify-evenly" onClick={() => setIsOpen(!isOpen)}>
        <div className="pl-1 text-shadow-md">{t.brand || "MARKA"}</div>
        <span
          className={`text-shadow-md text-xs transform duration-500 ${
            isOpen ? "rotate-x-180" : ""
          }`}
        >
          ▼
        </span>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 flex flex-col gap-1">
            {Array.isArray(brands) && brands.length > 0 ? (
              brands.map((brand) => {
                const isSelected = selectedBrand === brand;

                return (
                  <div
                    key={brand}
                    onClick={() => {
                      // Marka değişirse seçili modeli sıfırlamak için handler'ı çağırıyoruz
                      onFilterChange("brand", brand);
                      if (filters?.modelName) {
                        onFilterChange("modelName", null); // Yeni marka seçilince eski model seçimini temizle
                      }
                    }}
                    className={`text-shadow-md flex items-center p-1 gap-2 rounded cursor-pointer transition-colors hover:bg-slate-50 ${
                      isSelected
                        ? "bg-slate-50 ring-1 ring-slate-400 font-medium"
                        : ""
                    }`}
                  >
                    <span className="text-xs">{brand}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-gray-500 pl-1">
                Marka bulunamadı
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandFilterBox;
