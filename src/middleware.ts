import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const response = await updateSession(request);
    // Authz is enforced in admin layout via requireStaff (profile row required).
    return response;
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/access-disabled")) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/access-disabled"],
};
