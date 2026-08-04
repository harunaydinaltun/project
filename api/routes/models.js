import express from "express";
import {
  getAllModels,
  addModel,
  getModelBySelection,
  getDistinctBrands,
  getDistinctModelNames,
  getDistinctYears,
} from "../controllers/model.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllModels);
router.post("/", verifyAdmin, addModel);

router.get("/selection", verifyAdmin, getModelBySelection);
router.get("/brands", verifyAdmin, getDistinctBrands);
router.get("/model-names", verifyAdmin, getDistinctModelNames);
router.get("/years", verifyAdmin, getDistinctYears);

export default router;
