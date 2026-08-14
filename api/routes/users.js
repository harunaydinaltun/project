import express from "express";
import { changePassword, updateProfile } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.patch("/profile", verifyToken, updateProfile);
router.patch("/change-password", verifyToken, changePassword);

export default router;
