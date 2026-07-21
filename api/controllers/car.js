import { db } from "../connect.js";

export const getAvailableCars = (req, res) => {
  const { startDate, endDate, brand, modelName, color, locationId } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Başlangıç ve bitiş tarihleri zorunludur" });
  }

  const query = `
      SELECT 
        cars.id AS car_id,
        cars.licensePlate,             
        cars.dailyPrice,
        cars.deposit,
        cars.locationId,
        models.color,
        models.year,
        models.brand,          
        models.modelName,   
        models.img
      FROM cars
      INNER JOIN models ON cars.modelId = models.id
      LEFT JOIN rentals ON cars.id = rentals.car_id 
        AND (rentals.start_date <= ? AND rentals.end_date >= ?)
      WHERE rentals.id IS NULL
    `;

  const queryParams = [startDate, endDate];

  if (brand) {
    query += `AND models.brand = ?`;
    queryParams.push(brand);
  }
  if (modelName) {
    query += `AND models.modelName = ?`;
    queryParams.push(modelName);
  }
  if (color) {
    query += `AND models.color = ?`;
    queryParams.push(color);
  }
  if (locationId) {
    query += `AND models.locationId = ?`;
    queryParams.push(locationId);
  }

  db.query(query, queryParams, (err, data) => {
    if (err) {
      console.error("Backend hatası", err);

      return res.status(500).json({ message: "Sunucu hatası" });
    }

    return res.status(200).json(data);
  });
};
