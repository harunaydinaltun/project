import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import carRoutes from "./routes/cars.js";
import modelRoutes from "./routes/models.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/models", modelRoutes);

app.listen(8800, () => {
  console.log("API WORKS");
});
