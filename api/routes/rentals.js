import express from "express";
import {
  cancelRental,
  getRentalsById,
  setRentalActive,
  showConfirmedRentalsByLocId,
  showActiveRentalsByLocId,
  setRentalCompleted,
  showAllRentalsByLocId,
} from "../controllers/rental.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.get(
  "/getById",
  verifyRole(["admin", "manager", "customer"]),
  getRentalsById,
);
router.patch(
  "/cancelById",
  verifyRole(["admin", "manager", "customer"]),
  cancelRental,
);
router.get(
  "/getConfirmedByLocId",
  verifyRole(["admin", "manager"]),
  showConfirmedRentalsByLocId,
);

router.get(
  "/getActiveRentals",
  verifyRole(["admin", "manager"]),
  showActiveRentalsByLocId,
);

router.get(
  "/getAllByLocId",
  verifyRole(["admin", "manager"]),
  showAllRentalsByLocId,
);

router.patch("/setactive", verifyRole(["admin", "manager"]), setRentalActive);

router.patch(
  "/setcompleted",
  verifyRole(["admin", "manager"]),
  setRentalCompleted,
);

export default router;
