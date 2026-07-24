import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import AdminPanelPage from "./pages/AdminPanelPage";
import languages from "./lang/languages.json";
import { useEffect, useState } from "react";
import ResultsPage from "./pages/ResultsPage";
import DetailsPage from "./pages/DetailsPage";
import AdminEditCarPage from "./pages/AdminEditCarPage";
import RegisterPage from "./pages/RegisterPage";
import Test from "./pages/Test";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import ForgotYourPasswordPage from "./pages/ForgotYourPasswordPage";
const getSystemLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage || "";
  const shortLang = browserLang.substring(0, 2).toLowerCase();

  return shortLang === "tr" ? "tr" : "en";
};

export const AppContent = () => {
  const location = useLocation();

  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("app_language");

    return savedLang || getSystemLanguage();
  });
  useEffect(() => {
    localStorage.setItem("app_language", lang);
  }, [lang]);

  const t = languages[lang];

  return (
    <div className="bg-linear-to-b from-mist-100 to-mist-300 ">
      {location.pathname !== "/" && (
        <Navbar t={t} setLang={setLang} lang={lang} />
      )}
      <Routes>
        <Route
          path="/"
          element={<Home t={t} setLang={setLang} lang={lang} />}
        ></Route>
        <Route path="/test" element={<Test t={t} />}></Route>
        <Route path="/adminpanel" element={<AdminPanelPage t={t} />}></Route>
        <Route path="/results" element={<ResultsPage t={t} />}></Route>
        <Route path="/details/:id" element={<DetailsPage t={t} />}></Route>
        <Route path="/edit/:id" element={<AdminEditCarPage t={t} />}></Route>
        <Route path="/details/" element={<DetailsPage t={t} />}></Route>
        <Route path="/edit/" element={<AdminEditCarPage t={t} />}></Route>
        <Route path="/register/" element={<RegisterPage t={t} />}></Route>
        <Route path="/login/" element={<LoginPage t={t} />}></Route>
        <Route
          path="/psswrdrst/"
          element={<ForgotYourPasswordPage t={t} />}
        ></Route>
      </Routes>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AppContent></AppContent>
    </Router>
  );
};
export default App;
