import { NextRequest, NextResponse } from "next/server";
import { isCorrectPassword, hashPassword } from "@/lib/admin-auth";

const COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 saat

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!isCorrectPassword(password)) {
      return NextResponse.json({ ok: false, error: "Yanlış şifre" }, { status: 401 });
    }

    const value = await hashPassword(password);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: COOKIE_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Hata" }, { status: 500 });
  }
}
