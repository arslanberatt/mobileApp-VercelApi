import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismadb } from "@/lib/db";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email ve şifre zorunludur!" },
        { status: 400 }
      );
    }

    const user = await prismadb.user.findUnique({ where: { email } });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Geçersiz giriş bilgileri veya admin değil!" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Geçersiz giriş bilgileri!" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { message: "Giriş başarılı!", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Backend error:", error);
    return NextResponse.json(
      { message: "Bir şeyler ters gitti, lütfen tekrar deneyin." },
      { status: 500 }
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
