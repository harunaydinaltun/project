import { db } from "../connect.js";

export const getAvailableCars = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "başlangıç ve bitiş tarihleir zorunludur" });
  }

  try {
    const query = `
    SELECT *
    FROM cars 
    WHERE status = 'available'
    AND id NOT IN (
      SELECT car_id
      FROM rentals
      WHERE ? <= endDate AND ? >= startDate
    )`;

    const [availableCars] = await db.execute(query, [startDate, endDate]);
    return req.status(200).json(availableCars);
  } catch (error) {
    console.error("Backend hatasi", error);
    return req.status(500).json({ message: "Sunucu hatası" });
  }
};
