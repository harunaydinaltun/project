import { db } from "../connect.js";
import { locationSchema } from "../validations/LocationValidations.js";

export const getAllLocations = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT id, name as locationName, city, full_address FROM locations",
    );
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllLocationsAdmin = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT 
        l.id AS locationId, 
        l.name AS locationName, 
        l.full_address as fullAddress, 
        l.city, l.branch_manager_id as managerId, 
        u.name as managerName, 
        u.surname as managerSurname 
      FROM locations l
      LEFT JOIN users u ON l.branch_manager_id = u.id`);
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getLocInfo = async (req, res) => {
  const { locId } = req.query;

  if (!locId) {
    return res.status(400).json({ message: "Location ID is required!" });
  }

  const query = "SELECT * FROM locations WHERE id = ?";

  try {
    const [response] = await db.query(query, [locId]);
    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const editLocationInfo = async (req, res) => {
  const { locId } = req.query;
  const updateData = req.body;

  const keys = Object.keys(updateData);

  if (keys.length !== 1) {
    return res
      .status(400)
      .json({ error: "Sadece tek bir alan güncellenebilir." });
  }

  const fieldToUpdate = keys[0];
  const newValue = updateData[fieldToUpdate];

  const allowedFields = ["name", "full_address", "city", "branch_manager_id"];

  if (!allowedFields.includes(fieldToUpdate)) {
    return res
      .status(403)
      .json({ error: "Bu alanı güncelleme yetkiniz bulunmamaktadır." });
  }

  const fieldSchema = locationSchema.shape[fieldToUpdate];
  const validationResult = fieldSchema.safeParse(newValue);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }

  const validValue = validationResult.data;

  try {
    const query = `UPDATE locations SET ${fieldToUpdate} = ? WHERE id = ?`;

    await db.query(query, [validValue, locId]);

    res.status(200).json({ message: "Profil bilgisi başarıyla güncellendi." });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};

export const getManagers = async (req, res) => {
  try {
    const query =
      "SELECT id, name, surname FROM users WHERE user_type = 'manager'";

    const [managers] = await db.query(query);

    res.status(200).json({
      success: true,
      data: managers,
    });
  } catch (error) {
    console.error("Müdürleri çekerken hata oluştu:", error);
    res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};
