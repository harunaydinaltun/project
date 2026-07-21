import { useState } from "react";

export const ModelFilterBox = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-200 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300  max-w-40 cursor-pointer transition-all hover:shadow-lg ">
      <div
        className="flex justify-evenly"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="pl-1 text-shadow-md">{t.model}</div>
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
            <span>A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelFilterBox;
