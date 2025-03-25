import { NextResponse } from "next/server"; // NextResponse kullanıyoruz
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismadb } from "@/lib/db";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

// Admin yetkisini kontrol et
const verifyAdmin = async (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return (decoded as jwt.JwtPayload).role === "admin";
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Geçersiz istek!" }, { status: 405 });
  }

  const isAdmin = await verifyAdmin(req); // Admin yetkisini kontrol et
  if (!isAdmin) {
    return NextResponse.json({ message: "Yetkisiz işlem!" }, { status: 403 });
  }

  const { email, password, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email ve şifre zorunludur!" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prismadb.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });

    return NextResponse.json(
      { message: "Kullanıcı oluşturuldu!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Kullanıcı oluşturulamadı!" },
      { status: 500 }
    );
  }
}
