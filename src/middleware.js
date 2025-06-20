import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("access-token")?.value;
  const { pathname } = req.nextUrl;

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/view-request", req.url));
  }

  if (!token &&
    pathname.startsWith("/view-request") ||
    pathname.startsWith("/leave-request") ||
    pathname.startsWith("/reports") 
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if (!token && !pathname.startsWith("/view-request")) {
  //  return NextResponse.redirectNextResponse(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/view-request", "/reports", "/leave-request"],
};
