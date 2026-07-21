import { CAR_COLORS } from "../constants/carConstants.js";
import { useState } from "react";

const ColorFilterBox = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const handleColorSelect = (colorName) => {
    setSelectedColor((prev) => (prev === colorName ? null : colorName));
  };

  return (
    <div className="bg-slate-200 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300  max-w-40 cursor-pointer transition-all hover:shadow-lg ">
      <div
        className="flex justify-evenly"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="pl-1 text-shadow-md">{t.color}</div>
        <span
          className={`text-shadow-md text-xs transform duration-500 ${isOpen ? "rotate-x-180" : ""}`}
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
            {CAR_COLORS.map((c) => {
              const isSelected = selectedColor === c.name;

              return (
                <div
                  key={c.name}
                  onClick={() => handleColorSelect(c.name)}
                  className={`text-shadow-md flex items-center p-1 gap-2 rounded cursor-pointer transition-colors hover:bg-slate-50 ${
                    isSelected
                      ? "bg-slate-50 ring-1 ring-slate-400 font-medium"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="w-4 h-4 rounded-full ring-1 ring-black/10 shadow-sm shrink-0"
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                  <span className="text-xs ">{t.colorConstants[c.name]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorFilterBox;
