import { Package, RotateCcw, Truck } from "lucide-react";
import { EmptyStateCard } from "@/components/empty-state-card";
import { FlashBanner } from "@/components/flash-banner";
import { prisma } from "@/lib/prisma";
import { requireConsumer } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

type OrdersPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const orderImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCBpO7GkxOq0wSD1Jzj-J06FbYTmep7X9SzkzHwphER9Cr4XEHq-VxDw-NHM-449kZTCrU2GyXGS9fYYuCzc6W_LWfuFDJVxyEHiHfkq6MZrvowo0Fgf9OAPfgJnRV4X_ZFgssWPW1B658rxrIjiXkS_YU4RP7ZeSz6IveD9rzdpFMi4EVIqIu4dGx2DSUtBkUWGwyjTyS3DS1_cPLvABA8yhD1ZM2gzMK0ux2ICWj4urKDekyVlJxoL0uulpEYeM7BsQZJxPdPac",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1SP_mqMrkuWhNRRCxV7e-L-u2-YaadA-wsf7C2uLyK1jP1Gv-t406uX9ZCGX3Bm6CRdujbMyFgZb82-O7TInk6ac3LL-6B_MN5BMUsiwJUMSWKIxhYypoR4I20Mm8E8cfZ6qqoNU34JHKsTSyyB1CP9p0Z08Syq2ybYWrd-c8tZEzz5WbEmC0hkvaFX-UiAOOoI5QPO3NRW9Aop6-dsff2QFMMk_vruDoDnGsFoK0IZaD__dJ3fuhCnRdihs72klPwZI-os9jxFQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9AlUs1NqZUYnob44XUjrZhH0qtoipWo9A3Q3vA7eZ8j4d2v6yig-XLk-BZTReGuXUolz4krKprLD5-TT_rhiUp4Vvdq662mRqoYVRucadvGaz4nJ6M56HtITUApFFOJKA0Y7ybyGX7naQFHA221QABM4DAFva0WpxhqlNSRaJrcXwHSnI9tidAv6KXsLYMsIMzbHg0U52GAcD4xfd55n9IE20Tu5YF354FlL4HuMK_t1pXaa0pOiGi4pm9GwVHgEv_VCTLv8Wh8",
] as const;

// 订单页按 stitch/_3 的三种订单状态卡片风格重做，同时继续展示真实订单数据。
export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const user = await requireConsumer();
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      consumerId: user.id,
    },
    include: {
      merchant: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      <main className="mx-auto flex w-full max-w-3xl flex-col px-6 py-8 pt-10">
        <header className="mb-10">
          <h1 className="font-heading text-[3.5rem] font-extrabold leading-none tracking-[-0.03em] text-foreground">
            我的订单
          </h1>
          <p className="mt-2 text-base text-muted">您最近的精致体验与配送。</p>
        </header>

        {status === "created" && (
          <div className="mb-6">
            <FlashBanner
              tone="success"
              title="订单已创建"
              description="当前版本不做真实支付，你的订单已经成功进入订单列表。"
            />
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyStateCard
            title="还没有订单"
            description="先去首页挑选商品并完成第一单吧。"
            actionHref="/"
            actionLabel="返回首页"
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const image = orderImages[index] ?? orderImages[0];
              const firstItem = order.items[0];

              if (index === 0) {
                return (
                  <article
                    key={order.id}
                    className="group relative overflow-hidden rounded-[2rem] bg-card shadow-[0_4px_40px_rgba(78,33,35,0.06)]"
                  >
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
                      <div
                        className="h-40 w-full shrink-0 rounded-[1rem] bg-cover bg-center md:h-32 md:w-32"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <div className="flex flex-grow flex-col justify-between">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div>
                            <span className="mb-1 block text-sm font-semibold uppercase tracking-wider text-muted">
                              最近一单
                            </span>
                            <h2 className="font-heading text-2xl font-bold text-foreground">
                              {order.merchant.shopName}
                            </h2>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-full bg-card-soft px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-tertiary" />
                            <span className="text-xs font-semibold text-muted">
                              已完成
                            </span>
                          </div>
                        </div>
                        <p className="mb-4 text-sm text-muted">
                          {order.items.map((item) => item.productNameSnapshot).join("，")}
                        </p>
                        <div className="mt-auto flex items-end justify-between pt-4">
                          <span className="font-heading text-xl font-bold text-primary">
                            {formatPrice(order.totalAmount)}
                          </span>
                          <button className="rounded-full bg-card-strong px-5 py-2 text-sm font-semibold text-primary">
                            再来一单
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              if (index === 1) {
                return (
                  <article
                    key={order.id}
                    className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-card-soft p-6 md:flex-row"
                  >
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                    <div className="relative z-10 flex-grow">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <span className="mb-1 block text-sm font-semibold uppercase tracking-wider text-primary">
                            今天 • 预计稍后处理
                          </span>
                          <h2 className="font-heading text-xl font-bold text-foreground">
                            {order.merchant.shopName}
                          </h2>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1">
                          <Truck size={14} className="text-primary" />
                          <span className="text-xs font-bold text-primary">
                            配送中
                          </span>
                        </div>
                      </div>
                      <p className="mb-4 text-sm text-muted">
                        {firstItem?.productNameSnapshot ?? "订单商品"}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-white/50 pt-4">
                        <span className="font-heading text-lg font-bold text-foreground">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <button className="text-sm font-semibold text-primary">
                          查看物流
                        </button>
                      </div>
                    </div>
                    <div
                      className="order-first h-24 w-full shrink-0 rounded-[1rem] bg-cover bg-center md:order-last md:w-24"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  </article>
                );
              }

              return (
                <article
                  key={order.id}
                  className="flex flex-col items-center gap-6 rounded-[2rem] border border-border-soft/30 bg-background p-6 opacity-80 transition-opacity hover:opacity-100 md:flex-row"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-card-strong grayscale">
                    <Package size={26} className="text-muted" />
                  </div>
                  <div className="flex-grow">
                    <div className="mb-1 flex items-start justify-between">
                      <div>
                        <span className="mb-1 block text-sm font-medium uppercase tracking-wider text-muted/70">
                          更早订单
                        </span>
                        <h2 className="font-heading text-lg font-semibold text-muted">
                          {order.merchant.shopName}
                        </h2>
                      </div>
                      <div className="rounded-full border border-rose-200 px-3 py-1">
                        <span className="text-xs font-semibold text-rose-600">
                          已取消
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted/80">
                      {firstItem?.productNameSnapshot ?? "订单商品"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="mb-2 block font-heading text-lg font-medium text-muted/50 line-through">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-muted transition-colors hover:text-primary">
                      <RotateCcw size={13} />
                      重新预订
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-12 text-center">
            <button className="text-sm font-bold uppercase tracking-wide text-primary">
              查看更早的订单
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
