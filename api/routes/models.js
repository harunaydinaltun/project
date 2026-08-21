import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getAllModels,
  addModel,
  getModelBySelection,
  getDistinctBrands,
  getDistinctModelNames,
  getDistinctYears,
  editModel,
} from "../controllers/model.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/", getAllModels);
router.post("/", verifyRole(["admin"]), upload.single("image"), addModel);
router.patch("/:id", verifyRole(["admin"]), upload.single("image"), editModel);

router.get("/selection", verifyRole(["admin"]), getModelBySelection);
router.get("/brands", verifyRole(["admin"]), getDistinctBrands);
router.get("/model-names", verifyRole(["admin"]), getDistinctModelNames);
router.get("/years", verifyRole(["admin"]), getDistinctYears);

export default router;
