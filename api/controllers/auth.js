import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  const { password, tel_no, email, birthdate, name, surname } = req.body;

  if (!password || !email || !birthdate || !name || !surname || !tel_no) {
    return res.status(400).json({ error: "Please fill all fields." });
  }

  if (/[!-/]+/.test(name) || name.length > 45) {
    return res
      .status(400)
      .json({ error: "Name field can not contain special chars." });
  }

  if (/[!-/]+/.test(surname) || surname.length > 45) {
    return res
      .status(400)
      .json({ error: "Surname field can not contain special chars." });
  }

  if (
    password.length < 6 ||
    !/[a-zçğıöşü]+/.test(password) ||
    !/[A-ZÇĞİÖŞÜ]+/.test(password) ||
    !/[0-9]+/.test(password) ||
    !/[!-/]+/.test(password) ||
    /\s/.test(password) ||
    password.length > 64
  ) {
    return res.status(400).json({
      error: "Your password don't match requirements",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 255) {
    return res.status(400).json({
      error: "Email is not valid",
    });
  }

  if (tel_no.length !== 11 || !tel_no.startsWith("05")) {
    return res.status(400).json({
      error: "Tel no is not valid",
    });
  }

  const birthDateObj = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return res.status(400).json({ error: "You must be at least 18 years old" });
  }
  const connection = await db.getConnection();
  try {
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: "E-mail adress is already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO users (password, tel_no, email, birthdate, name, surname, verification_token) VALUES (?,?,?,?,?,?,?)",
      [
        hashedPassword,
        tel_no,
        email,
        birthdate,
        name,
        surname,
        verificationToken,
      ],
    );

    const userId = result.insertId;
    await connection.query("INSERT INTO customers (user_id) VALUES (?)", [
      userId,
    ]);

    await connection.commit();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Posta Adresinizi Doğrulayın - Araba Kiralama",
      html: `
        <h3>Hoş Geldiniz, ${name}!</h3>
        <p>Kayıt işleminizi tamamlamak için lütfen aşağıdaki bağlantıya tıklayarak e-posta adresinizi doğrulayın:</p>
        <a href="${verifyLink}" target="_blank">Hesabımı Doğrula</a>
        <br/><br/>
        <p>Eğer bu işlemi siz yapmadıysanız bu mesajı görmezden gelebilirsiniz.</p>
      `,
    });

    res.status(201).json({ message: "User has been created succesfuly!" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Server error" });
  } finally {
    connection.release;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      "SELECT u.* FROM users u INNER JOIN customers c ON u.id = c.user_id WHERE u.email = ?",
      [email],
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found or you are not a customer!" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong email or password" });
    }

    if (user.is_verified === 0) {
      return res.status(403).json({
        error:
          "Lütfen giriş yapmadan önce e-posta adresinize gönderilen bağlantı ile hesabınızı onaylayın.",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const {
      password: userPassword,
      verification_token,
      ...otherDetails
    } = user;

    res.status(200).json({
      message: "Login succesful!",
      token: token,
      user: otherDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "User has been logged out successfully!" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please enter your email adress" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    await db.query("DELETE FROM password_resets WHERE email = ?", [email]);
    await db.query(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?,?,?)",
      [email, token, expiresAt],
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Şifre Sıfırlama Talebi - Araba Kiralama",
      html: `
        <h3>Şifre Sıfırlama Talebi</h3>
        <p>Hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${resetLink}" target="_blank">Şifremi Sıfırla</a>
        <br/><br/>
        <p>Bu bağlantı <b>1 saat</b> boyunca geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      `,
    });

    res.status(200).json({
      message: "Şifre sıfırlama bağlantısı e-posta adresine gönderildi.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu tarafı hata" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Eksik bilgi gönderildi" });
  }

  if (
    newPassword.length < 6 ||
    newPassword.length > 64 ||
    !/[a-zçğıöşü]+/.test(newPassword) ||
    !/[A-ZÇĞİÖŞÜ]+/.test(newPassword) ||
    !/[0-9]+/.test(newPassword) ||
    !/[!-/]+/.test(newPassword) ||
    /\s/.test(newPassword)
  ) {
    return res
      .status(400)
      .json({ error: "Yeni şifreniz güvenlik gereksinimlerini karşılamıyor." });
  }

  try {
    const [resets] = await db.query(
      "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
      [token],
    );

    if (resets.length === 0) {
      return res
        .status(400)
        .json({ error: "Bağlantı geçersiz veya süresi dolmuş" });
    }

    const email = resets[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);
    await db.query("DELETE FROM password_resets WHERE email = ?", [email]);

    res.status(200).json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu tarafı hata" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token bulunamadı." });

  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE verification_token = ?",
      [token],
    );

    if (users.length === 0) {
      return res.status(400).json({
        error: "Geçersiz veya daha önce kullanılmış onay bağlantısı.",
      });
    }

    const user = users[0];

    let attempt = 0;
    const maxAttempts = 3;
    let isUpdated = false;

    while (attempt < maxAttempts && !isUpdated) {
      try {
        attempt++;
        await db.query(
          "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
          [user.id],
        );
        isUpdated = true;
      } catch (updateError) {
        console.error(
          `Güncelleme denemesi ${attempt} başarısız: `,
          updateError,
        );
        if (attempt === maxAttempts) {
          throw updateError;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    res.status(200).json({
      message:
        "E-posta adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.",
    });
  } catch (error) {
    console.error(
      "Maksimum deneme sayısına ulaşıldı, işlem başarısız: ",
      error,
    );
    res.status(500).json({
      error:
        "Sunucu tarafında bir hata oluştu. Lütfen bir kaç dakika sonra tekrar deneyiniz",
    });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admins] = await db.query(
      "SELECT u.*, a.role FROM users u INNER JOIN admins a ON u.id = a.user_id WHERE u.email = ?",
      [email],
    );

    if (admins.length === 0) {
      return res.status(404).json({ error: "Admin not found!" });
    }

    const admin = admins[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    const {
      password: adminPassword,
      verification_token,
      ...otherDetails
    } = admin;

    res.status(200).json({
      message: "Admin login succesful!",
      token: token,
      admin: otherDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Backend error!" });
  }
};

export const adminRegister = async (req, res) => {
  const { email, password, name, surname, tel_no, birthdate } = req.body;

  const connection = await db.getConnection();

  if (!email || !password || !name || !surname || !tel_no || !birthdate) {
    return res.status(400).json({ error: "Please fill all required fields!" });
  }

  try {
    const [existingAdmin] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingAdmin.length > 0) {
      connection.release();
      return res.status(400).json({ error: "This email is already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      "INSERT INTO users (password, tel_no, email, birthdate, name, surname, is_verified, user_type) VALUES (?, ?, ?, ?, ?, ?, 1, 'admin')",
      [hashedPassword, tel_no, email, birthdate, name, surname],
    );

    const userId = userResult.insertId;

    await connection.query(
      "INSERT INTO admins (user_id, role ) VALUES (?, 'admin')",
      [userId],
    );
    await connection.commit();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Backend error" });
  } finally {
    connection.release();
  }
};
