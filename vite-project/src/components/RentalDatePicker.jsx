export const RentalDatePicker = ({
  pickUpDate,
  setPickUpDate,
  pickUpTime,
  setPickUpTime,
  dropOffDate,
  setDropOffDate,
  dropOffTime,
  setDropOffTime,
  t = {}, // Çeviri objesi yoksa hata vermemesi için boş obje atandı
}) => {
  const today = new Date().toISOString().split("T")[0];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500">
          {t.recieveDate || "Alış Tarihi"}
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={pickUpDate}
            min={today}
            onChange={(e) => setPickUpDate(e.target.value)}
            className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
          />
          <select
            value={pickUpTime}
            onChange={(e) => setPickUpTime(e.target.value)}
            className="w-24 p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500">
          {t.deliveryDate || "İade Tarihi"}
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={dropOffDate}
            min={pickUpDate || today}
            onChange={(e) => setDropOffDate(e.target.value)}
            className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
          />
          <select
            value={dropOffTime}
            onChange={(e) => setDropOffTime(e.target.value)}
            className="w-24 p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RentalDatePicker;
