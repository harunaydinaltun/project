import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password, tel_no, email, birthdate, name, surname } =
    req.body;

  if (
    !username ||
    !password ||
    !email ||
    !birthdate ||
    !name ||
    !surname ||
    !tel_no
  ) {
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
      .json({ error: "Name field can not contain special chars." });
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

  if (
    /[!-/]+/.test(username) ||
    (username.length > 0 && /\s/.test(username)) ||
    username.length > 30
  ) {
    return res
      .status(400)
      .json({ error: "Username can not contain special chars or spaces" });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM customers WHERE username = ? OR email = ?",
      [username, email],
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or E-mail adress is already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO customers (username,password,tel_no,email,birthdate,name,surname) VALUES (?,?,?,?,?,?,?)",
      [username, hashedPassword, tel_no, email, birthdate, name, surname],
    );

    res.status(201).json({ message: "User has been created succesfuly!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query(
      "SELECT * FROM customers WHERE username = ?",
      [username],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const { password: userPassword, ...otherDetails } = user;

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
