"use client";

import Link from "next/link";
import { ShoppingBag, User2 } from "lucide-react";
import { ShellNavigation } from "@/components/shell-navigation";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

type AppShellProps = {
  children: React.ReactNode;
  user: SessionUser | null;
};

// 根布局外壳负责统一顶部导航，让消费者端和商家端都能共享同一套入口。
export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const avatarText = user?.username.slice(0, 1).toUpperCase() ?? "Y";
  const prototypeAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDXijEWoF_gPhlc2G_-4tG6Ky6O1TND9xvxN_lJRxgWS0RlBh0RD8rrXtBi4jmSkY9T37TQM_Er9FO70-YbgEKfDnFxlukLMAkAlNYL8CT_S7_sSvrHaGWkCAFIvEgAglCFMbLUkgMkjlf7KUL-Kj6xGOBotczsc6ffCB1z7i7USCsGBnF7N8Nc9jW3ww-5tUAGA8WWmSSJqdvmp8kc7eJuEoVb_MhrVf0fWhX93udIpUDIjK58ZAPhPaHNVCSs0sACPPvtqeCEBaw";
  const showHomeHeader = pathname === "/";
  const showConsumerBottomNav = pathname === "/" || pathname === "/orders";

  return (
    <div className="min-h-screen">
      {showHomeHeader ? (
        <header className="fixed top-0 z-40 w-full bg-background/80 backdrop-blur-xl">
          <div className="relative mx-auto flex max-w-[390px] items-center justify-between px-6 py-4">
            <Link
              href={user?.role === "MERCHANT" ? "/merchant" : "/"}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-card text-primary shadow-[0_10px_24px_rgba(78,33,35,0.08)]"
              aria-label="首页入口"
              style={
                !user
                  ? {
                      backgroundImage: `url(${prototypeAvatar})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : undefined
              }
            >
              {user ? (
                <span className="font-heading text-base font-extrabold">
                  {avatarText}
                </span>
              ) : (
                <User2 size={17} />
              )}
            </Link>

            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center">
              <p className="font-heading text-lg font-black tracking-[-0.05em] text-primary">
                都市生活
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!user ? (
                <Link
                  href="/auth"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card-soft text-primary"
                  aria-label="登录注册"
                >
                  <ShoppingBag size={16} />
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-background bg-tertiary" />
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <form action="/api/auth/logout" method="post">
                    <button className="rounded-full bg-card-soft px-3 py-2 text-xs font-bold text-primary">
                      退出
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>
      ) : null}

      <main className={showHomeHeader ? "pt-24" : undefined}>{children}</main>

      {showConsumerBottomNav ? <ShellNavigation user={user} /> : null}
    </div>
  );
}
