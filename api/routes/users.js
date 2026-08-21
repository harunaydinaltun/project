import express from "express";
import { changePassword, updateProfile } from "../controllers/user.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.patch(
  "/profile",
  verifyRole(["admin", "manager", "customer"]),
  updateProfile,
);
router.patch(
  "/change-password",
  verifyRole(["admin", "manager", "customer"]),
  changePassword,
);

export default router;
