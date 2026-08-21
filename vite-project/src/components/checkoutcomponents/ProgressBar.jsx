import { IoCheckmarkOutline } from "react-icons/io5";

export const ProgressBar = ({ step }) => {
  const steps = [
    { id: "packet", label: "Packet" },
    { id: "extra", label: "Extra" },
    { id: "credit", label: "Payment" },
    { id: "confirm", label: "Confirm" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 relative self-center">
      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 rounded-full"></div>

      {steps.map((s, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={s.id}
            className="flex flex-col items-center gap-2 bg-white px-2"
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ring-4 ring-white ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {isCompleted ? <IoCheckmarkOutline size={18} /> : index + 1}
            </div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isCurrent
                  ? "text-blue-600"
                  : isCompleted
                    ? "text-slate-700"
                    : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
