import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const unautorize = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = `/404/__unauthorized__`;
  return NextResponse.rewrite(url);
};

export default unautorize;
