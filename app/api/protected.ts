import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Authorization header'dan token'ı al
    const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      // Kullanıcı bilgilerini içeren başarılı doğrulama
      res
        .status(200)
        .json({ message: "Protected content", userId: decoded.userId });
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
