import express from "express";
import { processCheckout } from "../controllers/payment.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.post("/", verifyRole(["admin", "manager", "customer"]), processCheckout);

export default router;
