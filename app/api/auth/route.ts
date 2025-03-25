import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismadb } from "@/lib/db";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export async function POST(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",  // Bu satır tüm domainlere izin verir
    "Access-Control-Allow-Methods": "POST, OPTIONS", // Hangi HTTP metodlarına izin verileceğini belirtir
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Hangi header'ların izinli olduğunu belirtir
  };

  // CORS OPTIONS isteği için cevap ver
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, { status: 200, headers });
  }

  // Asıl API işlemleri burada
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email ve şifre zorunludur!" },
        { status: 400, headers }
      );
    }

    const user = await prismadb.user.findUnique({ where: { email } });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Geçersiz giriş bilgileri veya admin değil!" },
        { status: 401, headers }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Geçersiz giriş bilgileri!" },
        { status: 401, headers }
      );
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { message: "Giriş başarılı!", token },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Backend error:", error);
    return NextResponse.json(
      { message: "Bir şeyler ters gitti, lütfen tekrar deneyin." },
      { status: 500, headers }
    );
  }
}

export async function GET() {
  try {
    const hotels = await prismadb.user.findMany();

    return NextResponse.json(hotels);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
