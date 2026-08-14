import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthProvider.jsx";
import { LocationContextProvider } from "./context/LocationContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <LocationContextProvider>
      <App />
    </LocationContextProvider>
  </AuthContextProvider>,
);
