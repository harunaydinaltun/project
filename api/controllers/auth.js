import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import {
  registerSchema,
  adminRegisterSchema,
  forgotPasswordSchema,
  managerRegisterSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validations/AuthValidations.js";

export const register = async (req, res) => {
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res
      .status(400)
      .json({ error: validationResult.error.issues[0].message });
  }

  const { password, tel_no, email, birthdate, name, surname } =
    validationResult.data;

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
    connection.release();
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

    const token = jwt.sign(
      { id: user.id, role: "customer" },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

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
  const validationResult = forgotPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }
  const { email } = validationResult.data;

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
  const validationResult = resetPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }

  const { token, newPassword } = validationResult.data;

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
  const validationResult = verifyEmailSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }

  const { token } = validationResult.data;

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

export const adminRegister = async (req, res) => {
  const validationResult = adminRegisterSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }
  const { email, password, name, surname, tel_no, birthdate } =
    validationResult.data;

  const connection = await db.getConnection();

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

export const managerRegister = async (req, res) => {
  const validationResult = managerRegisterSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: validationResult.error.issues[0].message,
    });
  }
  let {
    email,
    password,
    name,
    surname,
    tel_no,
    birthdate,
    location_id,
    hire_date,
    department,
  } = validationResult.data;

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

    let responseMessage = "User has been created successfully!";

    if (location_id) {
      const [existingManager] = await connection.query(
        "SELECT user_id FROM managers WHERE location_id = ?",
        [location_id],
      );
      if (existingManager.length > 0) {
        location_id = null;
        responseMessage =
          'User has been created, but the branch you have choosed has already a manager. If you want to change the manager of this branch please go to "Show Branches" tab ';
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO users (password, tel_no, email, birthdate, name, surname, user_type) VALUES (?,?,?,?,?,?,'manager')",
      [hashedPassword, tel_no, email, birthdate, name, surname],
    );

    const userId = result.insertId;
    await connection.query(
      "INSERT INTO managers (user_id, location_id, hire_date, department) VALUES (?,?,?,?)",
      [userId, location_id, hire_date, department],
    );

    await connection.commit();

    res.status(201).json({ message: "User has been created succesfuly!" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Server error" });
  } finally {
    connection.release();
  }
};

export const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      `SELECT u.*, m.location_id
      FROM users u
      LEFT JOIN managers m ON u.id = m.user_id
      WHERE u.email = ? AND u.user_type IN ('admin','manager')`,
      [email],
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "Yetkili bulunamadı veya yetkiniz yok!" });
    }

    const staff = users[0];
    const isPasswordValid = await bcrypt.compare(password, staff.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Yanlış e-posta veya şifre" });
    }

    const token = jwt.sign(
      { id: staff.id, role: staff.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    const {
      password: staffPassword,
      verification_token,
      ...otherDetails
    } = staff;
    if (otherDetails.user_type === "admin") {
      delete otherDetails.location_id;
    }
    res.status(200).json({
      message: "Yetkili girişi başarılı!",
      token: token,
      user: otherDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Backend error!" });
  }
};
