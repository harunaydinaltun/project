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
  const userRole = req.user?.role;
  const { rentalId } = req.body;

  if (!rentalId) {
    return res.status(400).json({ message: "Rezervasyon ID'si gereklidir." });
  }

  try {
    let query;
    let queryParams;

    if (userRole === "customer") {
      query = `UPDATE rentals SET status = "canceled" WHERE id = ? AND user_id = ?`;
      queryParams = [rentalId, userId];
    } else if (userRole === "manager" || userRole === "admin") {
      query = `UPDATE rentals SET status = "canceled" WHERE id = ?`;
      queryParams = [rentalId];
    } else {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
    }

    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Rezervasyon bulunamadı veya bu işlem için yetkiniz yok.",
      });
    }

    return res
      .status(200)
      .json({ message: "Rezervasyon başarı ile iptal edildi" });
  } catch (error) {
    console.error("İptal işlemi hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const showConfirmedRentalsByLocId = async (req, res) => {
  const { locId } = req.query;
  if (!locId) {
    return res.status(400).json({ message: "Lokasyon ID'si gerekli!" });
  }

  try {
    const query = `
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        r.pickup_location_id,
        r.return_location_id,
        c.licensePlate,
        pk.name as packetName,
        m.brand,
        m.modelName,
        m.year,
        p.totalprice AS totalPrice,
        u.name AS customerName,
        u.surname AS customerSurname,
      GROUP_CONCAT(e.name SEPARATOR ', ') AS extras
      FROM rentals r
      LEFT JOIN cars c ON r.car_id = c.id
      LEFT JOIN models m ON c.modelId = m.id
      LEFT JOIN packets pk ON r.packet_id = pk.id
      LEFT JOIN payments p ON r.id = p.rental_id
      LEFT JOIN rentals_extra re ON r.id = re.rental_id
      LEFT JOIN extras e ON re.extra_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.pickup_location_id = ? AND r.status = 'confirmed'
      GROUP BY 
        r.id, 
        r.start_date, 
        r.end_date, 
        r.status,
        r.pickup_location_id,
        r.return_location_id,
        c.licensePlate, 
        m.brand, 
        m.modelName, 
        m.year, 
        p.totalprice, 
        u.name,
        u.surname,
        pk.name
      ORDER BY r.start_date DESC
    `;
    const [data] = await db.query(query, [locId]);
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ message: "Backend error" });
  }
};

export const setRentalActive = async (req, res) => {
  const { rentalId } = req.body;

  if (!rentalId) {
    return res.status(400).json({ message: "Eksik veri" });
  }

  const query = `
  UPDATE rentals 
  SET status = 'active' 
  WHERE id = ?`;

  try {
    const [response] = await db.query(query, [rentalId]);
    return res
      .status(200)
      .json({ message: "Rezervasyon aktif hale getirildi" });
  } catch (error) {
    return res.status(500).json({ message: "Sunucu Hatası" });
  }
};

export const showActiveRentalsByLocId = async (req, res) => {
  const { locId } = req.query;
  if (!locId) {
    return res.status(400).json({ message: "Lokasyon ID'si gerekli!" });
  }

  try {
    const query = `
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        r.pickup_location_id,
        r.return_location_id,
        c.licensePlate,
        pk.name as packetName,
        m.brand,
        m.modelName,
        m.year,
        p.totalprice AS totalPrice,
        u.name AS customerName,
        u.surname AS customerSurname,
      GROUP_CONCAT(e.name SEPARATOR ', ') AS extras
      FROM rentals r
      LEFT JOIN cars c ON r.car_id = c.id
      LEFT JOIN models m ON c.modelId = m.id
      LEFT JOIN packets pk ON r.packet_id = pk.id
      LEFT JOIN payments p ON r.id = p.rental_id
      LEFT JOIN rentals_extra re ON r.id = re.rental_id
      LEFT JOIN extras e ON re.extra_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.return_location_id = ? AND r.status = 'active'
      GROUP BY 
        r.id, 
        r.start_date, 
        r.end_date, 
        r.status,
        r.pickup_location_id,
        r.return_location_id,
        c.licensePlate, 
        m.brand, 
        m.modelName, 
        m.year, 
        p.totalprice, 
        u.name,
        u.surname,
        pk.name
      ORDER BY r.start_date DESC
    `;
    const [data] = await db.query(query, [locId]);
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ message: "Backend error" });
  }
};

export const setRentalCompleted = async (req, res) => {
  const { rentalId } = req.body;

  if (!rentalId) {
    return res.status(400).json({ message: "Eksik veri" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rentals] = await connection.query(
      "SELECT car_id, return_location_id FROM rentals WHERE id = ?",
      [rentalId],
    );

    if (rentals.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    const rental = rentals[0];

    await connection.query(
      "UPDATE rentals SET status = 'completed' WHERE id = ?",
      [rentalId],
    );

    await connection.query("UPDATE cars SET locationId = ? WHERE id = ?", [
      rental.return_location_id,
      rental.car_id,
    ]);

    await connection.commit();

    return res.status(200).json({
      message: "Rezervasyon tamamlandı ve araç lokasyonu güncellendi",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Tamamlama işlemi hatası:", error);
    return res.status(500).json({ message: "Sunucu Hatası" });
  } finally {
    connection.release();
  }
};

export const showAllRentalsByLocId = async (req, res) => {
  const { locId } = req.query;
  if (!locId) {
    return res.status(400).json({ message: "Lokasyon ID'si gerekli!" });
  }

  try {
    const query = `
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        r.pickup_location_id,
        r.return_location_id,
        c.licensePlate,
        pk.name as packetName,
        m.brand,
        m.modelName,
        m.year,
        p.totalprice AS totalPrice,
        u.name AS customerName,
        u.surname AS customerSurname,
      GROUP_CONCAT(e.name SEPARATOR ', ') AS extras
      FROM rentals r
      LEFT JOIN cars c ON r.car_id = c.id
      LEFT JOIN models m ON c.modelId = m.id
      LEFT JOIN packets pk ON r.packet_id = pk.id
      LEFT JOIN payments p ON r.id = p.rental_id
      LEFT JOIN rentals_extra re ON r.id = re.rental_id
      LEFT JOIN extras e ON re.extra_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.pickup_location_id = ? OR r.return_location_id = ?
      GROUP BY 
        r.id, 
        r.start_date, 
        r.end_date, 
        r.status,
        r.pickup_location_id,
        r.return_location_id,
        c.licensePlate, 
        m.brand, 
        m.modelName, 
        m.year, 
        p.totalprice, 
        u.name,
        u.surname,
        pk.name
      ORDER BY r.start_date DESC
    `;
    const [data] = await db.query(query, [locId, locId]);
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ message: "Backend error" });
  }
};
