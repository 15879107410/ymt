import { compareSync, hashSync } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "ymt_session";

export type SessionUser = {
  id: number;
  username: string;
  role: UserRole;
};

// 把密码统一转成 hash，避免数据库里保存明文密码。
export function hashPassword(password: string) {
  return hashSync(password, 10);
}

// 登录时用这个方法校验密码，避免每个接口重复写比较逻辑。
export function verifyPassword(password: string, passwordHash: string) {
  return compareSync(password, passwordHash);
}

// 这里用最简单的 cookie session 保存用户 id 和角色，足够支撑当前 MVP。
export async function createSession(user: SessionUser) {
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    JSON.stringify({ id: user.id, role: user.role, username: user.username }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );
}

// 退出登录时清掉 cookie 即可。
export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// 读取当前会话里的用户信息，用于导航、页面鉴权和接口鉴权。
export async function getSessionUser() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

// 某些页面只有登录后才能看，这个方法负责统一拦截。
export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
}

// 商家专属页面和接口统一走这个检查，避免消费者误进入商家后台。
export async function requireMerchant() {
  const user = await requireUser();

  if (user.role !== UserRole.MERCHANT) {
    redirect("/");
  }

  return user;
}

// 消费者专属页面统一走这个检查，避免商家端和消费者端混用。
export async function requireConsumer() {
  const user = await requireUser();

  if (user.role !== UserRole.CONSUMER) {
    redirect("/");
  }

  return user;
}

// 获取数据库里的完整用户信息，方便需要联表时使用。
export async function getCurrentDbUser() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      merchantProfile: true,
    },
  });
}
