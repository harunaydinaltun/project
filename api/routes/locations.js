import express from "express";
import {
  editLocationInfo,
  getAllLocations,
  getAllLocationsAdmin,
  getLocInfo,
  getManagers,
} from "../controllers/location.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/", getAllLocations);
router.get(
  "/allLocationInformations",
  verifyRole(["admin"]),
  getAllLocationsAdmin,
);
router.get("/getlocinfo", verifyRole(["admin"]), getLocInfo);
router.patch("/editlocinfo", verifyRole(["admin"]), editLocationInfo);
router.get("/managers", verifyRole(["admin"]), getManagers);
export default router;
