import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt_decode from "jwt-decode";
import unauthorize from "@/lib/unauthorize";
// or
// const Cookies = require('js-cookie')
import loginRequired from "@/lib/login-required";

interface IAuth {
  role: number;
}

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("access_token");

  if (!token) {
    console.log("No token found, redirecting to login...");
    return loginRequired(request);
  }

  const pathname = request.nextUrl.pathname;

  let auth: IAuth;

  try {
    auth = jwt_decode<IAuth>(token.value);
  } catch (error) {
    console.error("Failed to decode token:", error);
    const response = unauthorize(request);
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  if (pathname.startsWith("/lesson") || pathname.startsWith("/my-account")) {
    return NextResponse.next();
  }
  if (auth.role === 1 || auth.role === 3) {
    return NextResponse.next();
  }

  return unauthorize(request);
};

export const config = {
  matcher: ["/admin/:path*","/my-account/:path*", "/lesson/:path*", "/teacher/:path*"],
};
