import { IoReturnUpBackOutline } from "react-icons/io5";

export const ActiveRentals = ({ activeRentals, setPage }) => {
  return (
    <div className="min-h-screen flex justify-center items-start pt-20 px-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl ring-1 ring-slate-100 p-6 md:p-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <button
            className="flex items-center gap-x-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-300 active:scale-[0.98] cursor-pointer text-slate-600 font-medium"
            onClick={() => setPage("")}
          >
            <IoReturnUpBackOutline size={22} />
            <span>Geri</span>
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Aktif Rezervasyonlarım
          </h2>
          <div className="w-22 hidden md:block"></div>
        </div>
        <div className="w-full flex flex-col gap-5">
          {activeRentals && activeRentals.length > 0 ? (
            activeRentals.map((rental) => (
              <div
                key={rental.id}
                className="flex flex-col p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300 gap-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-800">
                    {rental.brand} {rental.modelName} {rental.year}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                    Devam Ediyor
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm w-full">
                  <div className="flex items-start gap-2">
                    <b className="text-slate-700 min-w-12.5">Alış:</b>
                    <span>{rental.start_date?.replace("T", " ")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <b className="text-slate-700 min-w-12.5">İade:</b>
                    <span>{rental.end_date?.replace("T", " ")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <b className="text-slate-700 min-w-12.5">Paket:</b>
                    <span>{rental.packetName || "-"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <b className="text-slate-700 min-w-12.5">Ekstra:</b>
                    <span className="leading-relaxed">
                      {rental.extras || "Yok"}
                    </span>
                  </div>
                </div>

                <span className="text-lg font-bold text-blue-600 mt-1 border-t border-slate-200 pt-3">
                  Toplam Tutar: {rental.totalPrice} ₺
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center">
              <span className="text-lg font-medium text-slate-700 mb-1">
                Şu an aktif bir kiralamanız bulunmuyor.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveRentals;
