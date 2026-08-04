import express from "express";
import { getAvailableCars, getCar, addCar } from "../controllers/car.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyAdmin, addCar);
router.get("/available", getAvailableCars);
router.get("/:id", getCar);

export default router;
