import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log(request.url + " url");
  (await cookies()).set("sf", "df");
  const res = NextResponse.json({ here: "dff" });
  res.headers.set("Set-Cookie", "sfgf");
  return res;
}
