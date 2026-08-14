import express from "express";
import { getPackets } from "../controllers/packet.js";

const router = express.Router();

router.get("/", getPackets);

export default router;
