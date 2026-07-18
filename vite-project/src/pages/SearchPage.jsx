import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SearchPage = ({ t }) => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Lütfen tarihleri girin");
      return;
    }

    navigate("/results", { state: { startDate, endDate } });
  };

  return (
    <form onSubmit={handleSearch}>
      <h2>{t.searchCar}</h2>
      <div>
        <label>{t.recieveDate}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>{t.deliveryDate}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button type="submit">{t.search}</button>
    </form>
  );
};

export default SearchPage;
