import { db } from "../connect.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;

  const keys = Object.keys(updateData);

  if (keys.length !== 1) {
    return res
      .status(400)
      .json({ error: "Sadece tek bir alan güncellenebilir." });
  }

  const fieldToUpdate = keys[0];
  const newValue = updateData[fieldToUpdate];

  const allowedFields = ["name", "surname", "tel_no"];

  if (!allowedFields.includes(fieldToUpdate)) {
    return res
      .status(403)
      .json({ error: "Bu alanı güncelleme yetkiniz bulunmamaktadır." });
  }

  try {
    const query = `UPDATE users SET ${fieldToUpdate} = ? WHERE id = ?`;

    await db.query(query, [newValue, userId]);

    res.status(200).json({ message: "Profil bilgisi başarıyla güncellendi." });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Lütfen mevcut ve yeni şifrelerinizi girin" });
  }

  if (
    newPassword.length < 6 ||
    !/[a-zçğıöşü]+/.test(newPassword) ||
    !/[A-ZÇĞİÖŞÜ]+/.test(newPassword) ||
    !/[0-9]+/.test(newPassword) ||
    !/[!-/]+/.test(newPassword) ||
    /\s/.test(newPassword) ||
    newPassword.length > 64
  ) {
    return res.status(400).json({
      error: "Your password don't match requirements",
    });
  }
  try {
    const [users] = await db.query(
      "SELECT id, password FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Mevcut şifreniz yanlış" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedNewPassword, userId],
    );
    return res.status(200).json({ message: "Şifreniz başarı ile güncellendi" });
  } catch (error) {
    return res.status(500).json({ error: "Server hatası" });
  }
};
