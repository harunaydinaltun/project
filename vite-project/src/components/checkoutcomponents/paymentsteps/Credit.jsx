import { CustomInput } from "../../CustomInput";

export const Credit = () => {
  return (
    <div className="flex gap-3">
      <div className="bg-slate-50 border p-5">
        <h1>KİMLİK BİLGİLERİ</h1>
        <CustomInput label="Kimlik Numarası" name="tcno" />

        <div className="flex gap-x-2">
          <CustomInput label="İsim" name="name" />
          <CustomInput label="Soyisim" name="surname" />
        </div>
        <CustomInput label="Telefon Numarası" name="telno" />
      </div>
      <div className="bg-slate-50 border p-5">
        <h1>ÖDEME BİLGİLERİ</h1>
        <CustomInput label="Kredi Kartı Numarası" name="creditno" />
        <div className="flex gap-x-2">
          <CustomInput label="Son Kullanma Tarihi" name="date" />
          <CustomInput label="CVV" name="cvv" />
        </div>
        <CustomInput label="Kart Üzerindeki İsim" name="cardowner" />
      </div>
      <button>ONAYLA</button>
    </div>
  );
};

export default Credit;
