import express from "express";
import { getAvailableCars, getCar } from "../controllers/car.js";

const router = express.Router();

router.get("/available", getAvailableCars);
router.get("/:id", getCar);

export default router;
