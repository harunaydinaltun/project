import { db } from "../connect.js";

export const getRentalsById = async (req, res) => {
  const user_id = req.user?.id;

  const query = `SELECT 
      r.id,
      r.start_date,
      r.end_date,
      r.status,
      pk.name as packetName,
      m.brand,
      m.modelName,
      m.year,
      p.totalprice AS totalPrice,
      GROUP_CONCAT(e.name SEPARATOR ', ') AS extras
    FROM rentals r
    INNER JOIN cars c ON r.car_id = c.id
    INNER JOIN models m ON c.modelId = m.id
    INNER JOIN packets pk ON r.packet_id = pk.id
    INNER JOIN payments p ON r.id = p.rental_id
    LEFT JOIN rentals_extra re ON r.id = re.rental_id
    LEFT JOIN extras e ON re.extra_id = e.id
    WHERE p.user_id = ?
    GROUP BY r.id, r.start_date, r.end_date, r.status, m.brand, m.modelName, m.year, p.totalprice, pk.name
    ORDER BY r.start_date DESC`;

  try {
    const [data] = await db.query(query, [user_id]);
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: "Backend Error" });
  }
};

export const cancelRental = async (req, res) => {
  const userId = req.user?.id;
  const { rentalId } = req.body;

  if (!rentalId) {
    return res.status(400).json({ message: "Rezervasyon ID'si gereklidir." });
  }

  try {
    const query = `UPDATE rentals
    SET status = "canceled" WHERE id = ? AND user_id = ?`;

    const [result] = await db.query(query, [rentalId, userId]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: "Rezervasyon bulunamadı veya bu işlem için yetkiniz yok.",
        });
    }

    return res
      .status(200)
      .json({ message: "Rezervasyon başarı ile iptal edildi" });
  } catch (error) {
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};
