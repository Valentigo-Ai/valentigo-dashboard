import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // ✅ ALWAYS allow auth-related routes
  if (
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/auth/callback")
  ) {
    return response;
  }

  const supabase = createMiddlewareClient({
    req: request,
    res: response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedRoutes = ["/dashboard", "/ai", "/listings"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔒 Not logged in → redirect
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Logged in → block login page
  if (session && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|.*\\.[^/]+$).*)",
  ],
};
