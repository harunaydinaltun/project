import express from "express";
import {
  addLocation,
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
router.post("/addloc", verifyRole(["admin"]), addLocation);
export default router;
