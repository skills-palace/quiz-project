import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const loginRequired = (request: NextRequest) => {

  const pathname = request.nextUrl.pathname;
  return NextResponse.redirect(
    new URL(`/login?redirect=${pathname}`, request.url)
  );
};

export default loginRequired;
