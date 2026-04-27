"use client";

import Link from "next/link";
import { Compass, Home, ReceiptText, User2 } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

type ShellNavigationProps = {
  user: SessionUser | null;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

// 这个组件统一管理顶部快捷入口和移动端底部导航，让“当前在哪个页面”更直观。
export function ShellNavigation({ user }: ShellNavigationProps) {
  const pathname = usePathname();

  const mobileLinks = [
    {
      key: "home",
      href: "/",
      label: "首页",
      icon: Home,
    },
    {
      key: "discover",
      href: "/",
      label: "发现",
      icon: Compass,
    },
    {
      key: "orders",
      href: "/orders",
      label: "订单",
      icon: ReceiptText,
    },
    {
      key: "profile",
      href: user?.role === "MERCHANT" ? "/merchant" : "/auth",
      label: "我的",
      icon: User2,
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[390px] -translate-x-1/2 items-center justify-around rounded-t-[2.5rem] bg-background/80 px-4 pb-6 pt-3 shadow-[0_-8px_30px_rgba(78,33,35,0.04)] backdrop-blur-2xl md:hidden">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const active =
            (link.key === "home" && pathname === "/") ||
            (link.key !== "discover" && isActivePath(pathname, link.href));

          return (
            <Link
              key={link.key}
              href={link.href}
              aria-label={link.label}
              className={clsx(
                "relative flex flex-col items-center justify-center rounded-full px-5 py-2 text-[10px] font-semibold tracking-wide transition-colors",
                active ? "bg-card-soft text-primary" : "text-muted hover:bg-card-soft/50",
              )}
            >
              <Icon className="mb-1" size={18} />
              <span>{link.label}</span>
              {link.label === "订单" ? (
                <span className="absolute right-4 top-2 h-2 w-2 rounded-full bg-primary" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
