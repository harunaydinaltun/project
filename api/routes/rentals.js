import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { cancelRental, getRentalsById } from "../controllers/rental.js";

const router = express.Router();

router.get("/getById", verifyToken, getRentalsById);
router.put("/cancelById", verifyToken, cancelRental);

export default router;
