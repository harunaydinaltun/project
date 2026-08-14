import { db } from "../connect.js";

export const getExtras = async (req, res) => {
  let querry =
    "SELECT id,name,description,price,isDaily FROM extras WHERE isActive = 1";

  try {
    const [data] = await db.query(querry);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
