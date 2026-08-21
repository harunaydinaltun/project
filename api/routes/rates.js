import express from "express";
import { getRates } from "../controllers/rate.js";

const router = express.Router();

router.get("/", getRates);

export default router;
