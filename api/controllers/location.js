import { db } from "../connect.js";

export const getAllLocations = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT id, name as locationName, city, full_address FROM locations",
    );
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
