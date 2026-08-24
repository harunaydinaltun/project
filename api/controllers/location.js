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
        l.city, 
        m.user_id as managerId, 
        u.name as managerName, 
        u.surname as managerSurname 
      FROM locations l
      LEFT JOIN managers m ON l.id = m.location_id
      LEFT JOIN users u ON m.user_id = u.id`);
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

  const query = `
    SELECT l.*, m.user_id as branch_manager_id 
    FROM locations l 
    LEFT JOIN managers m ON l.id = m.location_id 
    WHERE l.id = ?
  `;

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

  if (fieldToUpdate === "branch_manager_id") {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        "UPDATE managers SET location_id = NULL WHERE location_id = ?",
        [locId],
      );

      if (newValue !== "" && newValue !== null) {
        await connection.query(
          "UPDATE managers SET location_id = ? WHERE user_id = ?",
          [locId, newValue],
        );
      }

      await connection.commit();
      return res
        .status(200)
        .json({ message: "Şube müdürü başarıyla güncellendi." });
    } catch (error) {
      await connection.rollback();
      console.error("Yönetici atama hatası:", error);
      return res
        .status(500)
        .json({ error: "Müdür güncellenirken hata oluştu." });
    } finally {
      connection.release();
    }
  }

  const allowedFields = ["name", "full_address", "city"];

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
    const query = `
      SELECT u.id, u.name, u.surname, m.location_id 
      FROM users u 
      INNER JOIN managers m ON u.id = m.user_id 
      WHERE u.user_type = 'manager'
    `;

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

export const addLocation = async (req, res) => {
  const { name, city, full_address } = req.body;

  if (!name || !city || !full_address) {
    return res
      .status(400)
      .json({ error: "Lütfen tüm alanları eksiksiz doldurun." });
  }

  try {
    const query =
      "INSERT INTO locations (name, city, full_address) VALUES (?, ?, ?)";
    await db.query(query, [name, city, full_address]);

    return res.status(201).json({ message: "Yeni şube başarıyla eklendi." });
  } catch (error) {
    console.error("Şube ekleme hatası:", error);
    return res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};
