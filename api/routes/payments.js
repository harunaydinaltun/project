import express from "express";
import { processCheckout } from "../controllers/payment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, processCheckout);

export default router;
