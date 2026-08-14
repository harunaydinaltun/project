import { createContext, useContext } from "react";

export const LocationContext = createContext();

export const useLocations = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocations must be used within a LocationContextProvider",
    );
  }

  return context;
};
