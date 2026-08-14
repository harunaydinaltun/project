import express from "express";
import { getExtras } from "../controllers/extra.js";

const router = express.Router();

router.get("/", getExtras);

export default router;
