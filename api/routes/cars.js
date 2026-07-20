import express from "express";
import { getAvailableCars } from "../controllers/car.js";

const router = express.Router();

router.post("/available", getAvailableCars);

export default router;
