import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getExpectedCookieValue } from "@/lib/admin-auth";

const COOKIE_NAME = "admin_auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece /admin altındaki rotaları koru; /admin/login hariç
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  const expected = await getExpectedCookieValue();

  if (!cookieValue || cookieValue !== expected) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/events", "/admin/videos", "/admin/applicants", "/admin/messages", "/admin/about", "/admin/login"],
};
