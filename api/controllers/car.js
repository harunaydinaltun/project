import { db } from "../connect.js";

export const getAvailableCars = async (req, res) => {
  const {
    startDate,
    endDate,
    pickupLocationId,
    returnLocationId,
    brand,
    modelName,
    color,
    bodyType,
    doors,
    engineSize,
    trim,
    fuelType,
    gearType,
    maxPrice,
    userAge,
    page = 1,
    limit = 12,
  } = req.query;

  if (!startDate || !endDate || !pickupLocationId || !returnLocationId) {
    return res
      .status(400)
      .json({
        message:
          "Başlangıç tarihi, bitiş tarihi, alış ve teslim noktaları zorunludur",
      });
  }

  let baseQuery = `
      FROM cars
      INNER JOIN models ON cars.modelId = models.id
      WHERE 
        NOT EXISTS (
            SELECT 1 
            FROM rentals r 
            WHERE r.car_id = cars.id 
              AND r.start_date < ? 
              AND r.end_date > ?
        )
        AND ? = COALESCE(
            (
                SELECT r.return_location_id 
                FROM rentals r 
                WHERE r.car_id = cars.id 
                  AND r.end_date <= ?
                ORDER BY r.end_date DESC, r.id DESC 
                LIMIT 1
            ), 
            cars.locationId
        )
        AND ? = COALESCE(
            (
                SELECT r.pickup_location_id 
                FROM rentals r 
                WHERE r.car_id = cars.id 
                  AND r.start_date >= ?
                ORDER BY r.start_date ASC, r.id ASC 
                LIMIT 1
            ), 
            ?
        )
    `;

  const queryParams = [
    endDate,
    startDate,
    pickupLocationId,
    startDate,
    returnLocationId,
    endDate,
    returnLocationId,
  ];

  const parseMultiple = (val) => val.split(",");

  if (color) {
    baseQuery += ` AND cars.color IN (?)`;
    queryParams.push(parseMultiple(color));
  }
  if (modelName) {
    baseQuery += ` AND models.modelName IN (?)`;
    queryParams.push(parseMultiple(modelName));
  }
  if (brand) {
    baseQuery += ` AND models.brand IN (?)`;
    queryParams.push(parseMultiple(brand));
  }

  if (bodyType) {
    baseQuery += ` AND models.bodyType IN (?)`;
    queryParams.push(parseMultiple(bodyType));
  }
  if (doors) {
    baseQuery += ` AND models.doors IN (?)`;
    queryParams.push(parseMultiple(doors));
  }
  if (fuelType) {
    baseQuery += ` AND models.fuelType IN (?)`;
    queryParams.push(parseMultiple(fuelType));
  }
  if (gearType) {
    baseQuery += ` AND models.gearType IN (?)`;
    queryParams.push(parseMultiple(gearType));
  }
  if (trim) {
    baseQuery += ` AND models.trim IN (?)`;
    queryParams.push(parseMultiple(trim));
  }
  if (engineSize) {
    baseQuery += ` AND models.engineSize IN (?)`;
    queryParams.push(parseMultiple(engineSize));
  }
  if (maxPrice) {
    baseQuery += ` AND cars.dailyPrice <= ?`;
    queryParams.push(Number(maxPrice));
  }

  if (userAge) {
    baseQuery += ` AND models.minAge >= ?`;
    queryParams.push(Number(userAge));
  }

  const countQuery = `SELECT COUNT(cars.id) as totalCount ` + baseQuery;

  let dataQuery =
    `
      SELECT 
        cars.id AS car_id, cars.licensePlate, cars.dailyPrice, cars.deposit, cars.locationId,
        cars.color, models.year, models.brand, models.modelName, models.bodyType,
        models.doors, models.fuelType, models.gearType, models.trim, models.engineSize, models.minAge, models.img
  ` + baseQuery;

  const offset = (Number(page) - 1) * Number(limit);
  dataQuery += ` LIMIT ? OFFSET ?`;
  const dataParams = [...queryParams, Number(limit), Number(offset)];

  try {
    const [countResult] = await db.query(countQuery, queryParams);
    const totalCars = countResult[0].totalCount;
    const totalPages = Math.ceil(totalCars / Number(limit));

    const [data] = await db.query(dataQuery, dataParams);
    return res.status(200).json({
      data: data,
      pagination: {
        totalCars,
        totalPages,
        currentPage: Number(page),
      },
    });
  } catch (err) {
    console.error("Backend error: ", err.sqlMessage || err);
    return res
      .status(500)
      .json({ message: "Sunucu hatası", error: err.sqlMessage || err });
  }
};

export const getCar = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      cars.id AS car_id,
      cars.licensePlate,
      cars.dailyPrice,
      cars.deposit,
      cars.locationId,
      cars.color,
      models.year,
      models.trim,
      models.engineSize,
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
    WHERE cars.id = ? `;

  try {
    const [data] = await db.query(query, [id]);

    if (data.length === 0) {
      return res.status(404).json({ error: "Araç bulunamadı" });
    }
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Backend eror:", err.sqlMessage || err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.sqlMessage || err });
  }
};

export const addCar = async (req, res) => {
  const {
    licensePlate,
    dailyPrice,
    deposit,
    locationId,
    color,
    modelId,
    kilometer,
  } = req.body;

  const query = `
    INSERT INTO cars (licensePlate, dailyPrice, deposit, locationId, color, modelId, kilometer)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [
      licensePlate,
      dailyPrice,
      deposit,
      locationId,
      color,
      modelId,
      kilometer,
    ]);
    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Backend error:", err.sqlMessage || err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.sqlMessage || err });
  }
};
