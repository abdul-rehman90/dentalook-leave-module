import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("access-token")?.value;
  const { pathname } = req.nextUrl;

  // If token exists and user tries to access "/", redirect to /view-request
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/view-request", req.url));
  }

  // If token exists and user tries to access "/forgot-password", redirect to /
  if (token && pathname === "/forgot-password") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If token does not exist and user tries to access anything except "/" or "/forgot-password", redirect to /
  if (
    !token &&
    pathname !== "/" &&
    pathname !== "/forgot-password"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/view-request", "/reports", "/leave-request", "/forgot-password", "/((?!_next|favicon.ico|assets|api).*)"],
};