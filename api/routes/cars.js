import express from "express";
import {
  getAvailableCars,
  getCar,
  addCar,
  getCarCountByModelId,
} from "../controllers/car.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyAdmin, addCar);
router.get("/available", getAvailableCars);
router.get("/countByModel", getCarCountByModelId);
router.get("/:id", getCar);

export default router;
