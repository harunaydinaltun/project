import express from "express";
import {
  getAvailableCars,
  getCar,
  addCar,
  getCarCountByModelId,
  getCarsByLocationId,
} from "../controllers/car.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.post("/", verifyRole(["admin"]), addCar);
router.get("/available", getAvailableCars);
router.get("/countByModel", getCarCountByModelId);
router.get(
  "/getcarsbylocationid",
  verifyRole(["admin", "manager"]),
  getCarsByLocationId,
);
router.get("/:id", getCar);

export default router;
