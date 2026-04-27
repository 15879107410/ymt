import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // 这里把 Prisma 实例挂到全局，避免开发模式热更新时重复创建连接。
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
