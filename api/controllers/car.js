import { parse } from "dotenv";
import { db } from "../connect.js";

export const getAvailableCars = async (req, res) => {
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
    maxPrice,
    userAge,
    page = 1,
    limit = 12,
  } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Başlangıç ve bitiş tarihleri zorunludur" });
  }

  let baseQuery = `
      FROM cars
      INNER JOIN models ON cars.modelId = models.id
      LEFT JOIN rentals ON cars.id = rentals.car_id 
      AND (rentals.end_date >= ? AND rentals.start_date <= ?)
      WHERE rentals.id IS NULL
    `;

  const queryParams = [startDate, endDate];
  const parseMultiple = (val) => val.split(",");

  if (color) {
    baseQuery += ` AND models.color IN (?)`;
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
  if (locationId) {
    baseQuery += ` AND cars.locationId IN (?)`;
    queryParams.push(parseMultiple(locationId));
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
  if (maxPrice) {
    baseQuery += ` AND cars.dailyPrice <= ?`;
    queryParams.push(Number(maxPrice));
  }

  if (userAge) {
    baseQuery += ` AND models.minAge <= ?`;
    queryParams.push(Number(userAge));
  }

  const countQuery = `SELECT COUNT(cars.id) as totalCount ` + baseQuery;

  let dataQuery =
    `
      SELECT 
        cars.id AS car_id, cars.licensePlate, cars.dailyPrice, cars.deposit, cars.locationId,
        models.color, models.year, models.brand, models.modelName, models.bodyType,
        models.doors, models.fuelType, models.gearType, models.minAge, models.img
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
      models.color,
      models.year,
      models.brand,
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
