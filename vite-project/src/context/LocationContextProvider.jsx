import { useState, useEffect } from "react";
import { LocationContext } from "./LocationContext";
import api from "../utils/api";

export const LocationContextProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/locations");
        setLocations(res.data.data || []);
      } catch (error) {
        console.error("Lokasyonlar çekilirken hata oluştu:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const getLocationName = (id) => {
    if (!id) return "-";
    const found = locations.find((loc) => loc.id === Number(id));
    return found ? found.locationName : id;
  };

  const getLocationAddress = (id) => {
    if (!id) return "-";
    const found = locations.find((loc) => loc.id === Number(id));
    return found ? found.full_address : "-";
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        isLoadingLocations,
        getLocationName,
        getLocationAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
