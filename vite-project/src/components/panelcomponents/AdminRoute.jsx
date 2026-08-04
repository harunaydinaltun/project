import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") {
    setTimeout(() => navigate("/login"), 3000);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <span className="text-2xl text-shadow-2xl">
          Yetkisiz erişim tespit edildi. Anasayfaya yönlendiriliyorsunuz...
        </span>
      </div>
    );
  }

  return children;
};
