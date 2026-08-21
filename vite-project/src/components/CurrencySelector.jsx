import { useState, useRef, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";
import {
  TbCurrencyLira,
  TbCurrencyDollar,
  TbCurrencyEuro,
} from "react-icons/tb";

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currencies = [
    { code: "TRY", icon: <TbCurrencyLira size={20} /> },
    { code: "USD", icon: <TbCurrencyDollar size={20} /> },
    { code: "EUR", icon: <TbCurrencyEuro size={20} /> },
  ];

  const activeCurrency =
    currencies.find((c) => c.code === currency) || currencies[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition-all duration-300 font-medium text-sm active:scale-95 cursor-pointer shadow-sm border border-slate-200"
      >
        {activeCurrency.icon}
        <span>{activeCurrency.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-down origin-top-right">
          <div className="flex flex-col py-1">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                  currency === curr.code
                    ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
                }`}
              >
                <span
                  className={`${currency === curr.code ? "text-blue-600" : "text-slate-400"}`}
                >
                  {curr.icon}
                </span>
                {curr.code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
