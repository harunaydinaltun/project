import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Erişim reddedildi. Geçerli bir oturum bulunamadı." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secretKey);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return res
      .status(403)
      .json({ message: "Oturum süreniz dolmuş veya geçersiz token." });
  }
};
