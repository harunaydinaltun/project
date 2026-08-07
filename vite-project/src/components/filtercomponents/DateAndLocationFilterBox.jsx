export const DateAndLocationFilterBox = ({ setIsPoppedUp }) => {
  return (
    <div
      className="bg-cyan-500 ring-1 rounded-2xl mt-1.5 p-2 ring-slate-300 max-w-40 transition-all shadow-sm cursor-pointer hover:shadow-lg duration-500"
      onClick={() => {
        setIsPoppedUp(true);
      }}
    >
      <div className="pl-1 text-shadow-lg font-semibold text-slate-200">
        Tarih veya Konum Değiştir
      </div>
    </div>
  );
};

export default DateAndLocationFilterBox;
