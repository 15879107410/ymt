import Link from "next/link";
import {
  Bell,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Store,
} from "lucide-react";
import clsx from "clsx";

type MerchantWorkspaceShellProps = {
  title: string;
  description: string;
  activePath: "dashboard" | "profile" | "products" | "orders";
  children: React.ReactNode;
};

const links = [
  {
    key: "dashboard",
    label: "工作台",
    href: "/merchant",
    icon: LayoutDashboard,
  },
  {
    key: "orders",
    label: "订单管理",
    href: "/merchant/orders",
    icon: ClipboardList,
  },
  {
    key: "products",
    label: "商品管理",
    href: "/merchant/products",
    icon: Boxes,
  },
  {
    key: "profile",
    label: "商家入驻",
    href: "/merchant/profile",
    icon: Store,
  },
] as const;

// 商家工作区外壳按 stitch/_7/_8/_9/_10 的后台结构统一：桌面侧边栏、固定顶栏、移动底部导航。
export function MerchantWorkspaceShell({
  title,
  description,
  activePath,
  children,
}: MerchantWorkspaceShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 overflow-y-auto rounded-r-[2rem] bg-background px-6 pb-8 pt-24 shadow-[40px_0_60px_-15px_rgba(78,33,35,0.06)] md:flex md:flex-col">
        <div className="mb-10 mt-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] shadow-sm" />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-tight">
              Lumière Boutique
            </span>
            <span className="text-xs font-medium text-muted">已认证商家</span>
          </div>
        </div>

        <nav className="flex w-full flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.key}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold transition-all duration-300",
                  activePath === link.key
                    ? "bg-card-soft text-primary"
                    : "text-muted hover:translate-x-1 hover:text-primary",
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}

          <button className="mt-auto flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold text-muted transition-all duration-300 hover:translate-x-1 hover:text-primary">
            <Settings size={18} />
            设置
          </button>
        </nav>
      </aside>

      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-md md:pl-[19rem]">
        <div className="flex items-center gap-3">
          <span className="font-heading text-xl font-extrabold tracking-[-0.04em] text-primary">
            Lumière Merchant
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-soft">
            <Bell size={18} />
          </button>
          <div className="h-10 w-10 rounded-full bg-card-strong shadow-sm" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-32 pt-24 md:pb-12 md:pl-[20rem] md:pr-8 xl:pr-12">
        <div className="mb-10 max-w-3xl">
          <h1 className="font-heading text-[2.5rem] font-extrabold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">{description}</p>
        </div>

        <section>{children}</section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around bg-background/80 px-4 pb-6 pt-3 backdrop-blur-xl md:hidden">
        <Link
          href="/merchant"
          className={clsx(
            "flex flex-col items-center justify-center pb-2 text-[10px] font-bold uppercase tracking-widest",
            activePath === "dashboard" ? "text-primary" : "text-muted",
          )}
        >
          <Store size={22} className="mb-1" />
          首页
        </Link>
        <Link
          href="/merchant/orders"
          className={clsx(
            "flex flex-col items-center justify-center pb-2 text-[10px] font-bold uppercase tracking-widest",
            activePath === "orders" ? "text-primary" : "text-muted",
          )}
        >
          <ClipboardList size={22} className="mb-1" />
          订单
        </Link>
        <Link
          href="/merchant/products"
          className={clsx(
            "flex flex-col items-center justify-center pb-2 text-[10px] font-bold uppercase tracking-widest",
            activePath === "products" ? "text-primary" : "text-muted",
          )}
        >
          <Boxes size={22} className="mb-1" />
          商品
        </Link>
        <Link
          href="/merchant/profile"
          className={clsx(
            "flex flex-col items-center justify-center pb-2 text-[10px] font-bold uppercase tracking-widest",
            activePath === "profile" ? "text-primary" : "text-muted",
          )}
        >
          <LayoutDashboard size={22} className="mb-1" />
          我的
        </Link>
      </nav>
    </div>
  );
}
