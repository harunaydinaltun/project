import { useState, useEffect } from "react";
import api from "../utils/api";

export const RentalDatePicker = ({
  pickUpLocation,
  setPickUpLocation,
  dropOffLocation,
  setDropOffLocation,
  pickUpDate,
  setPickUpDate,
  pickUpTime,
  setPickUpTime,
  dropOffDate,
  setDropOffDate,
  dropOffTime,
  setDropOffTime,
  t = {},
}) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api
      .get("/locations")
      .then((res) => {
        setLocations(res.data.data);
      })
      .catch((err) => console.error("Lokasyon verisi alınamadı:", err));
  }, []);

  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  const currentHour = now.getHours();

  const getAvailableTimes = (selectedDate, isDropOff = false) => {
    let startHour = 0;

    if (selectedDate === today) {
      startHour = currentHour;
    }

    if (isDropOff && selectedDate === pickUpDate && pickUpTime) {
      const pickUpHour = parseInt(pickUpTime.split(":")[0]);
      if (pickUpHour > startHour) {
        startHour = pickUpHour;
      }
    }

    return Array.from({ length: 24 - startHour }, (_, i) => {
      const hour = (i + startHour).toString().padStart(2, "0");
      return `${hour}:00`;
    });
  };

  const pickUpTimeOptions = getAvailableTimes(pickUpDate);
  const dropOffTimeOptions = getAvailableTimes(dropOffDate, true);

  useEffect(() => {
    if (pickUpDate === today && pickUpTime) {
      const selectedHour = parseInt(pickUpTime.split(":")[0]);
      if (selectedHour < currentHour) {
        setPickUpTime(`${currentHour.toString().padStart(2, "0")}:00`);
      }
    }
  }, [pickUpDate, pickUpTime, today, currentHour, setPickUpTime]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500">
          {t.pickUpInfo || "Alış Noktası ve Tarihi"}
        </label>

        <select
          value={pickUpLocation}
          onChange={(e) => setPickUpLocation(e.target.value)}
          className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 mb-1"
        >
          <option value="" disabled>
            Alış lokasyonu seçin...
          </option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.id}
            </option>
          ))}
        </select>

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
            {pickUpTimeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500">
          {t.dropOffInfo || "İade Noktası ve Tarihi"}
        </label>

        <select
          value={dropOffLocation}
          onChange={(e) => setDropOffLocation(e.target.value)}
          className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 mb-1"
        >
          <option value="" disabled>
            İade lokasyonu seçin...
          </option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.id}
            </option>
          ))}
        </select>

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
            {dropOffTimeOptions.map((time) => (
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
