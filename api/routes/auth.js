import express from "express";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  adminRegister,
  adminLogin,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset_password", resetPassword);
//router.post("/admin-register", adminRegister);
router.post("/admin-login", adminLogin);

export default router;
