import { useState } from "react";

export const MinAgeFilterBox = ({ t, userAge, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-200 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300 max-w-40 transition-all shadow-sm">
      <div
        className="flex justify-evenly cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="pl-1 text-shadow-md text-sm font-semibold text-slate-700">
          {t.minAge}
        </div>
        <span
          className={`text-shadow-md text-xs transform duration-500 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 pb-1 px-1 flex flex-col gap-2">
            <span className="text-xs text-center font-bold text-blue-600">
              {userAge}+ Yaş
            </span>
            <input
              type="range"
              min="18"
              max="30"
              step="1"
              value={userAge}
              onChange={(e) => onFilterChange("userAge", e.target.value)}
              className="w-full h-1.5 bg-slate-300 rounded-lg  cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinAgeFilterBox;
