import { db } from "../connect.js";

export const getPackets = async (req, res) => {
  let querry =
    "SELECT id, name, details, features, price, isRecommended FROM packets WHERE isActive = 1";

  try {
    const [data] = await db.query(querry);
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Backend error: ", error.sqlMessage || error);
    return res.status(500).json({ message: "Backend error", error: error });
  }
};
