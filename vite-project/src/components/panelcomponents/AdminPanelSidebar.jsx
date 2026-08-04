export const AdminPanelSidebar = ({ setActiveTab }) => {
  return (
    <div className="flex flex-col justify-center max-w-40 bg-slate-200 border rounded-sm mt-1 shadow-lg max-h-40 ">
      <div
        className="border-b hover:bg-slate-300 cursor-pointer active:scale-[0.99] duration-150 p-1"
        onClick={() => setActiveTab("branches")}
      >
        <span className="text-xl text-shadow-2xs">Şubeleri Görüntüle</span>
      </div>
      <div
        className="border-b hover:bg-slate-300 cursor-pointer active:scale-[0.99] duration-150 p-1"
        onClick={() => setActiveTab("addcars")}
      >
        <span className="text-xl text-shadow-2xs">Fiziksel Araba Ekle</span>
      </div>
      <div
        className=" hover:bg-slate-300 cursor-pointer active:scale-[0.99] duration-150 p-1"
        onClick={() => setActiveTab("addmodels")}
      >
        <span className="text-xl text-shadow-2xs">Model Ekle</span>
      </div>
    </div>
  );
};

export default AdminPanelSidebar;
