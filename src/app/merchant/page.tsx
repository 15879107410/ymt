import Link from "next/link";
import { Boxes, Receipt, Store } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { requireMerchant } from "@/lib/auth";
import { MerchantWorkspaceShell } from "@/components/merchant-workspace-shell";
import { prisma } from "@/lib/prisma";

// 商家首页不做复杂仪表盘，只给出最重要的三条入口，贴合当前 MVP 范围。
export default async function MerchantHomePage() {
  const user = await requireMerchant();

  const merchant = await prisma.merchantProfile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      products: true,
      orders: true,
    },
  });

  // 这些摘要数字只围绕当前 MVP 主链路展开，不引入复杂经营报表。
  const activeProducts =
    merchant?.products.filter((product) => product.status === "ACTIVE").length ?? 0;
  const pendingOrders =
    merchant?.orders.filter((order) => order.status === "PENDING").length ?? 0;
  const completedOrders =
    merchant?.orders.filter((order) => order.status === "COMPLETED").length ?? 0;

  return (
    <MerchantWorkspaceShell
      title={merchant?.shopName ?? "欢迎来到商家后台"}
      description="当前后台优先只做入驻、商品管理、订单处理三条主链路，不增加复杂统计面板，方便先把 MVP 跑通。"
      activePath="dashboard"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardStatCard
          label="当前上架商品"
          value={activeProducts}
          description="只有已上架商品会显示在消费者首页，方便你快速判断当前可售内容。"
          tone="accent"
        />
        <DashboardStatCard
          label="待处理订单"
          value={pendingOrders}
          description="这里的数字越大，越需要尽快去订单管理页完成接单处理。"
        />
        <DashboardStatCard
          label="已完成订单"
          value={completedOrders}
          description="这个数字代表当前店铺已经走完的订单闭环，适合用于演示 MVP 成果。"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Link
          href="/merchant/profile"
          className="surface-soft rounded-[2rem] p-6 transition-transform hover:-translate-y-1"
        >
          <Store className="text-primary" />
          <p className="mt-4 font-heading text-2xl font-extrabold">店铺信息</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            维护入驻资料、联系人和店铺简介。
          </p>
        </Link>
        <Link
          href="/merchant/products"
          className="surface-soft rounded-[2rem] p-6 transition-transform hover:-translate-y-1"
        >
          <Boxes className="text-primary" />
          <p className="mt-4 font-heading text-2xl font-extrabold">商品管理</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            当前已有 {merchant?.products.length ?? 0} 个商品，点击继续管理。
          </p>
        </Link>
        <Link
          href="/merchant/orders"
          className="surface-soft rounded-[2rem] p-6 transition-transform hover:-translate-y-1"
        >
          <Receipt className="text-primary" />
          <p className="mt-4 font-heading text-2xl font-extrabold">订单管理</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            当前累计 {merchant?.orders.length ?? 0} 条订单，处理待接单数据。
          </p>
        </Link>
      </div>
    </MerchantWorkspaceShell>
  );
}
