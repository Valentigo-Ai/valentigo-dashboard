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

  const protectedRoutes = ["/", "/generator", "/leads", "/settings", "/ai-tools"];
  const isProtected = protectedRoutes.some((route) =>
    pathname === route || (route !== "/" && pathname.startsWith(route))
  );

  // 🔒 Not logged in → redirect
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Logged in → block login/signup pages
  if (session && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|.*\\.[^/]+$).*)",
  ],
};
