import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

// 退出登录只清理当前 cookie，然后回到首页即可。
export async function POST(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/", request.url));
}
