import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token; // Mengecek apakah pengguna sudah login
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Jika belum login, redirect ke halaman login
  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika sudah login tetapi mengakses halaman login, redirect ke halaman utama
  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // Terapkan middleware ke semua rute kecuali API dan file statis
};