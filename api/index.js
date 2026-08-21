import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import carRoutes from "./routes/cars.js";
import modelRoutes from "./routes/models.js";
import locationRoutes from "./routes/locations.js";
import packetRoutes from "./routes/packets.js";
import extraRoutes from "./routes/extras.js";
import paymentRoutes from "./routes/payments.js";
import rentalRoutes from "./routes/rentals.js";
import rateRoutes from "./routes/rates.js";
import { fetchExchangeRates } from "./utils/exchangeRate.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/packets", packetRoutes);
app.use("/api/extras", extraRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/rates", rateRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(8800, () => {
  console.log("API WORKS");
  fetchExchangeRates();
});
