import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export const AdminPanelSidebar = ({ setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <aside
      className={`flex flex-col bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden p-2 gap-y-1 mt-1 duration-200 ${isOpen ? "w-52" : "w-16 items-center"}`}
    >
      <button
        type="button"
        className={`flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all duration-150 cursor-pointer ${
          isOpen ? "self-end mb-4" : "w-full mb-4"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Menüyü Gizle" : "Menüyü Göster"}
      >
        {isOpen ? <IoChevronBack size={24} /> : <IoChevronForward size={24} />}
      </button>

      {isOpen && (
        <div>
          <button
            type="button"
            className="w-full text-left px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all duration-150 cursor-pointer"
            onClick={() => setActiveTab("addmanager")}
          >
            Şube Yöneticisi Ekle
          </button>
          <button
            type="button"
            className="w-full text-left px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all duration-150 cursor-pointer"
            onClick={() => setActiveTab("branches")}
          >
            Şubeleri Görüntüle
          </button>

          <button
            type="button"
            className="w-full text-left px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all duration-150 cursor-pointer"
            onClick={() => setActiveTab("addcars")}
          >
            Fiziksel Araba Ekle
          </button>

          <button
            type="button"
            className="w-full text-left px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all duration-150 cursor-pointer"
            onClick={() => setActiveTab("addmodels")}
          >
            Model Ekle
          </button>

          <button
            type="button"
            className="w-full text-left px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all duration-150 cursor-pointer"
            onClick={() => setActiveTab("showmodels")}
          >
            Modelleri Görüntüle
          </button>
        </div>
      )}
    </aside>
  );
};

export default AdminPanelSidebar;
