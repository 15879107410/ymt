import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

// 登录接口只做最基础的用户名密码校验，符合当前假登录方案。
export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.redirect(new URL("/auth?status=invalid", request.url));
  }

  await createSession({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return NextResponse.redirect(
    new URL(user.role === "MERCHANT" ? "/merchant" : "/", request.url),
  );
}
