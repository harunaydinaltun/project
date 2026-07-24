import { db } from "../connect.js";

export const getAvailableCars = (req, res) => {
  const {
    startDate,
    endDate,
    brand,
    modelName,
    color,
    locationId,
    bodyType,
    doors,
    fuelType,
    gearType,
    minAge,
  } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Başlangıç ve bitiş tarihleri zorunludur" });
  }

  let query = `
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
        models.bodyType,
        models.doors,
        models.fuelType,
        models.gearType,
        models.minAge,
        models.img
      FROM cars
      INNER JOIN models ON cars.modelId = models.id
      LEFT JOIN rentals ON cars.id = rentals.car_id 
      AND (rentals.end_date >= ? AND rentals.start_date <= ?)
      WHERE rentals.id IS NULL
    `;

  const queryParams = [startDate, endDate];

  if (color) {
    query += ` AND models.color = ?`;
    queryParams.push(color);
  }
  if (modelName) {
    query += ` AND models.modelName = ?`;
    queryParams.push(modelName);
  }
  if (brand) {
    query += ` AND models.brand = ?`;
    queryParams.push(brand);
  }
  if (locationId) {
    query += ` AND cars.locationId = ?`;
    queryParams.push(locationId);
  }

  if (bodyType) {
    query += ` AND models.bodyType = ?`;
    queryParams.push(bodyType);
  }
  if (doors) {
    query += ` AND models.doors = ?`;
    queryParams.push(doors);
  }
  if (fuelType) {
    query += ` AND models.fuelType = ?`;
    queryParams.push(fuelType);
  }
  if (gearType) {
    query += ` AND models.gearType = ?`;
    queryParams.push(gearType);
  }
  if (minAge) {
    query += ` AND models.minAge > ?`;
    queryParams.push(minAge);
  }

  // 5. Sorguyu Çalıştır
  db.query(query, queryParams, (err, data) => {
    if (err) {
      console.error("SQL / Backend hatası:", err.sqlMessage || err);
      return res
        .status(500)
        .json({ message: "Sunucu hatası", error: err.sqlMessage });
    }

    return res.status(200).json(data);
  });
};
