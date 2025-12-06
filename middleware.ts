import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSiteByHost } from "./src/lib/sites";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const siteMatch = getSiteByHost(request.headers.get("host"));
  if (!siteMatch) {
    return NextResponse.next();
  }

  if (pathname.startsWith(`/${siteMatch.site.slug}`)) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/${siteMatch.site.slug}${pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
