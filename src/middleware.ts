import { NextRequest, NextResponse, userAgent } from "next/server";
import Constants from "./utils/constants";
import Routes from "./utils/routes";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  if (pathname === Routes.auth) {
    return res;
  }

  // console.log(req.cookies);

  //check if this condition is actually necessary
  if (!res.cookies.has(Constants.userAgentKey))
    res.cookies.set(Constants.userAgentKey, JSON.stringify(userAgent(req)));

  console.log(req.cookies);
  console.log("af");

  const token =
    req.cookies.get(Constants.accessTokenKey) ||
    req.cookies.get(Constants.refreshTokenKey);
  const _user = req.cookies.get(Constants.userKey)?.value;
  const user = _user ? (JSON.parse(_user) as Record<string, unknown>) : null;

  console.log(token);
  console.log(user);

  if (!token || !user) {
    return NextResponse.redirect(new URL(`${Routes.auth}?page=login`, req.url));
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
