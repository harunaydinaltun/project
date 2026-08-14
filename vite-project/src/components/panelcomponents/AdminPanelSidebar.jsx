export const AdminPanelSidebar = ({ setActiveTab }) => {
  return (
    <aside className="flex flex-col w-64 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden p-2 gap-y-1 mt-1">
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
    </aside>
  );
};

export default AdminPanelSidebar;
