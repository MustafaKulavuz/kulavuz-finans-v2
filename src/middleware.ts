import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Kullanıcının giriş yapıp yapmadığını kontrol eden çerez (cookie)
  const sessionToken =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  const { pathname } = request.nextUrl;

  // 1. Eğer kullanıcı zaten giriş yapmışsa ve Login/Register sayfasına gitmeye çalışıyorsa -> Ana sayfaya at
  if (sessionToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Eğer kullanıcı giriş YAPMAMIŞSA ve Ana Sayfaya (Dashboard) girmeye çalışıyorsa -> Login'e at
  if (!sessionToken && pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Bu kuralların hangi sayfalarda çalışacağını belirtiyoruz
export const config = {
  matcher: ["/", "/login", "/register"],
};
