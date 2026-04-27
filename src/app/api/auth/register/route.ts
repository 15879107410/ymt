import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/validations";

// 注册接口在当前版本里会直接创建用户并自动登录。
export async function POST(request: Request) {
  const formData = await request.formData();

  const parsed = authSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/auth/register?status=validation", request.url));
  }

  const { username, password, role } = parsed.data;

  const exists = await prisma.user.findUnique({
    where: { username },
  });

  if (exists) {
    return NextResponse.redirect(new URL("/auth/register?status=exists", request.url));
  }

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hashPassword(password),
      role: role as UserRole,
      merchantProfile:
        role === "MERCHANT"
          ? {
              create: {
                shopName: `${username} 的店铺`,
                contactName: username,
                contactPhone: "待补充",
                address: "待补充",
                description: "新注册商家，等待完善店铺资料。",
              },
            }
          : undefined,
    },
  });

  await createSession({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return NextResponse.redirect(
    new URL(user.role === "MERCHANT" ? "/merchant/profile" : "/", request.url),
  );
}
