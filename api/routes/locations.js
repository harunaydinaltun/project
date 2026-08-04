import express from "express";
import { getAllLocations } from "../controllers/location.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllLocations);

export default router;
