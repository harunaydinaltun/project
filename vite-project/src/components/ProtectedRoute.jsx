import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser || !allowedRoles.includes(currentUser.user_type)) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate, allowedRoles]);

  if (!currentUser || !allowedRoles.includes(currentUser.user_type)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <span className="text-2xl text-shadow-2xl">
          Yetkisiz erişim tespit edildi. Giriş sayfasına yönlendiriliyorsunuz...
        </span>
      </div>
    );
  }

  return children;
};
