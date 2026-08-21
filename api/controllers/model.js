import { db } from "../connect.js";
import { addModelSchema } from "../validations/ModelValidations.js";

export const getAllModels = async (req, res) => {
  let query = "SELECT * FROM models ORDER BY brand";

  try {
    const [data] = await db.query(query);
    return res.status(200).json({ data: data });
  } catch (error) {
    console.error("Backend error: ", error.sqlMessage || error);
    return res.status(500).json({ message: "Backend error", error: error });
  }
};

export const addModel = async (req, res) => {
  const validationResult = addModelSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res
      .status(400)
      .json({ error: validationResult.error.issues[0].message });
  }

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
  } = validationResult.data;

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

export const editModel = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const keys = Object.keys(updateData);

  if (keys.length !== 1) {
    return res
      .status(400)
      .json({ error: "Sadece tek bir alan güncellenebilir." });
  }

  const fieldToUpdate = keys[0];
  const newValue = updateData[fieldToUpdate];

  const allowedFields = [
    "brand",
    "modelName",
    "trim",
    "engineSize",
    "year",
    "fuelType",
    "gearType",
    "bodyType",
    "doors",
    "minAge",
  ];

  if (!allowedFields.includes(fieldToUpdate)) {
    return res
      .status(400)
      .json({ error: "Geçersiz veya yetkisiz alan güncelleme isteği." });
  }
  const fieldSchema = addModelSchema.shape[fieldToUpdate];
  const validationResult = fieldSchema.safeParse(newValue);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }

  try {
    const query = `UPDATE models SET ${fieldToUpdate} = ? WHERE id = ?`;

    await db.query(query, [newValue, id]);

    res.status(200).json({ message: "Model bilgisi başarıyla güncellendi." });
  } catch (error) {
    console.error("Model güncelleme hatası:", error);
    res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};
