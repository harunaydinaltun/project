import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminPanelPage from "./pages/AdminPanelPage";
import languages from "./lang/languages.json";
import { useEffect, useState } from "react";
import ResultsPage from "./pages/ResultsPage";
import DetailsPage from "./pages/DetailsPage";
import AdminEditCarPage from "./pages/AdminEditCarPage";
import RegisterPage from "./pages/RegisterPage";
import Test from "./pages/Test";
const getSystemLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const shortLang = browserLang.substring(0, 2).toLowerCase();

  return shortLang === "tr" ? "tr" : "en";
};

export const App = () => {
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("app_language");

    return savedLang || getSystemLanguage();
  });
  useEffect(() => {
    localStorage.setItem("app_language", lang);
  }, [lang]);

  const t = languages[lang];

  return (
    <Router>
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
      </Routes>
      {/*<Footer setLang={setLang} lang={lang}></Footer>*/}
    </Router>
  );
};
export default App;
