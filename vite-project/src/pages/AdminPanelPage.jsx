import AdminAddModel from "../components/AdminAddModel";
import AdminAddCar from "..//components/AdminAddCar";
import AdminCarList from "../components/AdminCarList";
import AdminCarModelList from "../components/AdminCarModelList";

export const AdminPanelPage = ({ t }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold mb-1.5">{t.adminPanel}</h1>
      <div className="flex justify-between space-x-4">
        <AdminAddModel t={t}></AdminAddModel>
        <AdminAddCar t={t}></AdminAddCar>
      </div>
      <div className="flex justify-between space-x-4 mt-2.5">
        <AdminCarList t={t}></AdminCarList>
        <AdminCarModelList t={t}></AdminCarModelList>
      </div>
    </div>
  );
};

export default AdminPanelPage;
