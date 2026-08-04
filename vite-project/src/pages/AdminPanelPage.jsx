import { useState } from "react";
import AdminPanelSidebar from "../components/panelcomponents/AdminPanelSidebar";
import { useAuth } from "../context/AuthContext";
import AdminAddModel from "../components/panelcomponents/AdminAddModel";
import AdminAddCar from "../components/panelcomponents/AdminAddCar";

export const AdminPanelPage = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("welcome");

  return (
    <div className="flex min-w-full min-h-screen">
      <AdminPanelSidebar setActiveTab={setActiveTab}></AdminPanelSidebar>
      <div className="flex-1 flex flex-col items-center">
        <span>Hoşgeldiniz {currentUser.username}</span>
        {activeTab === "welcome" && (
          <span>Sol taraftaki menüyü kullanınız</span>
        )}
        {activeTab === "branches" && <span>Şubeler</span>}
        {activeTab === "addcars" && <AdminAddCar></AdminAddCar>}
        {activeTab === "addmodels" && <AdminAddModel></AdminAddModel>}
      </div>
    </div>
  );
};

export default AdminPanelPage;
