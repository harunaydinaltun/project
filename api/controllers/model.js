import { db } from "../connect.js";

export const getAllModels = async (req, res) => {
  let query = "SELECT * FROM models";

  try {
    const [data] = await db.query(query);
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Backend error: ", error.sqlMessage || error);
    return res.status(500).json({ message: "Backend error", error: error });
  }
};

export const addModel = async (req, res) => {
  const {
    brand,
    modelName,
    year,
    trim,
    engineSize,
    fuelType,
    gearType,
    bodyType,
    doors,
    minAge,
  } = req.body;

  if (
    !brand ||
    !modelName ||
    !year ||
    !engineSize ||
    !trim ||
    !fuelType ||
    !gearType ||
    !bodyType ||
    !doors ||
    !minAge
  ) {
    return res.status(400).json({ error: "Please fill all fields." });
  }

  try {
    const [existingModel] = await db.query(
      "SELECT * FROM models WHERE LOWER(brand) = LOWER(?) AND LOWER(modelName) = LOWER(?) AND year = ? AND LOWER(bodyType) = LOWER(?) AND LOWER(engineSize) = LOWER(?) AND LOWER(trim) = LOWER(?) AND LOWER(fuelType) = LOWER(?) AND LOWER(gearType) = LOWER(?)",
      [brand, modelName, year, bodyType, engineSize, trim, fuelType, gearType],
    );

    if (existingModel.length > 0) {
      return res.status(400).json({ error: "Model already exists!" });
    }

    const [result] = await db.query(
      "INSERT INTO models (brand, modelName, year, engineSize, trim, fuelType, gearType, bodyType, doors, minAge) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        brand,
        modelName,
        year,
        engineSize,
        trim,
        fuelType,
        gearType,
        bodyType,
        doors,
        minAge,
      ],
    );

    res.status(201).json({ message: "New model has been added succesfuly" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getModelBySelection = async (req, res) => {
  const {
    brand,
    modelName,
    year,
    bodyType,
    engineSize,
    trim,
    fuelType,
    gearType,
  } = req.query;

  let baseQuery = `SELECT * FROM models WHERE 1=1`;

  if (brand) {
    baseQuery += ` AND LOWER(brand) = LOWER(?)`;
  }
  if (modelName) {
    baseQuery += ` AND LOWER(modelName) = LOWER(?)`;
  }
  if (year) {
    baseQuery += ` AND year = ?`;
  }
  if (bodyType) {
    baseQuery += ` AND LOWER(bodyType) = LOWER(?)`;
  }
  if (engineSize) {
    baseQuery += ` AND LOWER(engineSize) = LOWER(?)`;
  }
  if (trim) {
    baseQuery += ` AND LOWER(trim) = LOWER(?)`;
  }
  if (fuelType) {
    baseQuery += ` AND LOWER(fuelType) = LOWER(?)`;
  }
  if (gearType) {
    baseQuery += ` AND LOWER(gearType) = LOWER(?)`;
  }

  try {
    const [data] = await db.query(baseQuery, [
      brand,
      modelName,
      year,
      bodyType,
      engineSize,
      trim,
      fuelType,
      gearType,
    ]);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Backend error: ", error.sqlMessage || error);
    res.status(500).json({ message: "Backend error", error: error });
  }
};

export const getDistinctBrands = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT DISTINCT brand FROM models ORDER BY brand ASC",
    );

    return res.status(200).json({ data: data.map((item) => item.brand) });
  } catch (error) {
    console.error("Backend error: ", error);
    return res.status(500).json({ message: "Backend error", error });
  }
};

export const getDistinctModelNames = async (req, res) => {
  const { brand } = req.query;
  try {
    const [data] = await db.query(
      "SELECT DISTINCT modelName FROM models WHERE LOWER(brand) = LOWER(?) ORDER BY modelName ASC",
      [brand],
    );
    return res.status(200).json({ data: data.map((item) => item.modelName) });
  } catch (error) {
    console.error("Backend error: ", error);
    return res.status(500).json({ message: "Backend error", error });
  }
};

export const getDistinctYears = async (req, res) => {
  const { brand, modelName } = req.query;
  try {
    const [data] = await db.query(
      "SELECT DISTINCT year FROM models WHERE LOWER(brand) = LOWER(?) AND LOWER(modelName) = LOWER(?) ORDER BY year DESC",
      [brand, modelName],
    );
    return res.status(200).json({ data: data.map((item) => item.year) });
  } catch (error) {
    console.error("Backend error: ", error);
    return res.status(500).json({ message: "Backend error", error });
  }
};
