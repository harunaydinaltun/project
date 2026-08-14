import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import languages from "./lang/languages.json";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import ResultsPage from "./pages/ResultsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import Test from "./pages/Test";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import { AdminRoute } from "./components/panelcomponents/AdminRoute";
import CheckoutPage from "./pages/CheckoutPage";
import ProfileRentals from "./pages/ProfileRentals";
import ProfileSettings from "./pages/ProfileSettings";

const getSystemLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage || "";
  const shortLang = browserLang.substring(0, 2).toLowerCase();

  return shortLang === "tr" ? "tr" : "en";
};

export const AppContent = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("app_language");

    return savedLang || getSystemLanguage();
  });
  useEffect(() => {
    localStorage.setItem("app_language", lang);
  }, [lang]);

  const t = languages[lang];

  return (
    <div className="bg-linear-to-b from-mist-100 to-mist-300 min-h-screen ">
      {location.pathname !== "/" && (
        <Navbar t={t} setLang={setLang} lang={lang} />
      )}
      <Routes>
        <Route
          path="/"
          element={<Home t={t} setLang={setLang} lang={lang} />}
        />
        <Route path="/test" element={<Test t={t} />} />
        <Route
          path="/profile"
          element={
            currentUser ? <ProfilePage t={t} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile/rentals"
          element={
            currentUser ? <ProfileRentals t={t} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile/settings"
          element={
            currentUser ? <ProfileSettings t={t} /> : <Navigate to="/login" />
          }
        />
        <Route path="/results" element={<ResultsPage t={t} />} />
        <Route path="/cars/:id" element={<CarDetailsPage t={t} />} />
        <Route
          path="checkout"
          element={currentUser ? <CheckoutPage /> : <Navigate to="/login" />}
        />

        <Route path="/details/" element={<CarDetailsPage t={t} />} />

        <Route
          path="/register/"
          element={currentUser ? <Navigate to="/" /> : <RegisterPage t={t} />}
        />
        <Route
          path="/login/"
          element={currentUser ? <Navigate to="/" /> : <LoginPage t={t} />}
        />
        <Route
          path="/forgot-password/"
          element={<ForgotPasswordPage t={t} />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage t={t} />}
        />
        <Route
          path="/verify-email/:token"
          element={<VerifyEmailPage t={t} />}
        />
        <Route
          path="/adminlogin/"
          element={
            currentUser ? <Navigate to="/admin" /> : <AdminLoginPage t={t} />
          }
        />
        <Route
          path="/admin/"
          element={
            <AdminRoute>
              <AdminPanelPage />
            </AdminRoute>
          }
        />
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
