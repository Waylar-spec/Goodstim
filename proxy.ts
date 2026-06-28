import { NextRequest, NextResponse } from "next/server";

// Sekretny klucz do podglądu prawdziwej strony podczas maintenance.
// Wejdź na https://goodstim.pl/?preview=gs-podglad-2026 — ustawi ciasteczko
// i od tego momentu widzisz normalną stronę (przez 7 dni).
const BYPASS_KEY = "gs-podglad-2026";

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Ochrona panelu admin — sprawdź przed maintenance
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminCookie = req.cookies.get("gs_admin")?.value;
    if (!adminCookie || adminCookie !== process.env.ADMIN_PASSWORD) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Maintenance wyłączony → wszystko działa normalnie
  if (process.env.MAINTENANCE_MODE !== "1") return NextResponse.next();

  // Przepuść zasoby wewnętrzne, API (webhooki Stripe, maile) i samą stronę maintenance
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/maintenance" ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Podgląd dla właściciela: ?preview=KLUCZ ustawia ciasteczko bypass
  if (searchParams.get("preview") === BYPASS_KEY) {
    const res = NextResponse.next();
    res.cookies.set("gs_bypass", BYPASS_KEY, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  }
  if (req.cookies.get("gs_bypass")?.value === BYPASS_KEY) {
    return NextResponse.next();
  }

  // Reszta ruchu → strona "w przygotowaniu"
  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
