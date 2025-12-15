import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // ✅ ALWAYS allow Supabase auth routes
  if (
    pathname.startsWith("/reset-password") ||
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

  // Protected pages
  const protectedRoutes = ["/dashboard", "/ai", "/listings"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1️⃣ Not logged in → redirect to /login
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣ Logged in → block /login
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
