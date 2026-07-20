import { db } from "../connect.js";
export const getAvailableCars = (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      console.log("❌ Tarihler eksik geldi!");
      return res.status(400).json({ error: "Lütfen tarihleri girin." });
    }

    const q = `
      SELECT cars.* FROM cars 
      LEFT JOIN rentals ON cars.id = rentals.car_id 
      AND (rentals.start_date <= ? AND rentals.end_date >= ?)
      WHERE rentals.id IS NULL
    `;

    db.query(q, [endDate, startDate], (err, data) => {
      if (err) {
        console.error("❌ MySQL Sorgu Hatası:", err);
        return res
          .status(500)
          .json({ error: "Veritabanı hatası", details: err.message });
      }

      console.log("✅ Sorgu başarılı, dönen araç sayısı:", data.length);
      return res.status(200).json({ success: true, data: data });
    });
  } catch (globalError) {
    // Kod içinde SQL dışında bir şey patlarsa burası yakalar
    console.error("❌ CATCH BLOK HATASI:", globalError);
    return res
      .status(500)
      .json({ error: "Sunucu içi çökme", details: globalError.message });
  }
};
