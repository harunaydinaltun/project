import express from "express";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  adminRegister,
  managerRegister,
  staffLogin,
} from "../controllers/auth.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/admin-register", verifyRole(["admin"]), adminRegister);
router.post("/staff-login", staffLogin);
router.post("/manager-register", verifyRole(["admin"]), managerRegister);

export default router;
