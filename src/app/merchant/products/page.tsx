import Link from "next/link";
import { Search } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { EmptyStateCard } from "@/components/empty-state-card";
import { FlashBanner } from "@/components/flash-banner";
import { requireMerchant } from "@/lib/auth";
import { MerchantWorkspaceShell } from "@/components/merchant-workspace-shell";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  getProductStatusLabel,
  getProductStatusTone,
} from "@/lib/utils";

type MerchantProductsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

// 商品管理页按 stitch/_8 的搜索栏 + 大卡片列表结构重排，继续接当前真实商品数据。
export default async function MerchantProductsPage({
  searchParams,
}: MerchantProductsPageProps) {
  const user = await requireMerchant();
  const { status } = await searchParams;

  const merchant = await prisma.merchantProfile.findUnique({
    where: { userId: user.id },
  });

  const products = await prisma.product.findMany({
    where: {
      merchantId: merchant?.id ?? -1,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeCount = products.filter((product) => product.status === "ACTIVE").length;
  const draftCount = products.filter((product) => product.status === "DRAFT").length;
  const inactiveCount = products.filter((product) => product.status === "INACTIVE").length;

  return (
    <MerchantWorkspaceShell
      title="商品库存"
      description="管理您的商品系列"
      activePath="products"
    >
      <div className="space-y-6">
        {status === "created" && (
          <FlashBanner
            tone="success"
            title="商品已创建"
            description="新商品已经写入数据库，如果状态为上架，就会立刻出现在消费者首页。"
          />
        )}
        {status === "updated" && (
          <FlashBanner
            tone="success"
            title="商品已更新"
            description="当前商品的价格、库存和描述已经保存。"
          />
        )}
        {status === "toggled" && (
          <FlashBanner
            tone="info"
            title="商品状态已切换"
            description="你刚刚执行了上架或下架操作，消费者端可见范围已经同步更新。"
          />
        )}
        {status === "validation" && (
          <FlashBanner
            tone="error"
            title="商品信息未保存"
            description="请检查商品名称、价格、库存和描述是否填写完整。"
          />
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardStatCard
            label="已上架"
            value={activeCount}
            description="这些商品已经能被消费者看到并发起下单。"
            tone="accent"
          />
          <DashboardStatCard
            label="草稿"
            value={draftCount}
            description="适合先占位录入信息，补全后再改成上架。"
          />
          <DashboardStatCard
            label="已下架"
            value={inactiveCount}
            description="当前不会出现在首页，适合临时停卖的商品。"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-[2rem] bg-card p-5 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:flex-row md:items-center md:justify-between">
          <span className="text-sm font-medium text-foreground">全部商品</span>
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              className="w-full rounded-full bg-card-soft py-3 pl-10 pr-4 text-sm text-foreground outline-none"
              placeholder="搜索商品名称..."
              readOnly
            />
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyStateCard
            title="还没有商品"
            description="先添加第一个商品，消费者首页和商品详情页才会有可展示内容。"
            actionHref="/merchant/products/new"
            actionLabel="新增商品"
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[2rem] bg-card shadow-[0_8px_30px_rgba(78,33,35,0.04)]"
              >
                <div className="relative h-52 overflow-hidden bg-[linear-gradient(135deg,#240305,#803f9e,#ff7859)]">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute left-5 top-5 flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${getProductStatusTone(product.status)}`}
                    >
                      {getProductStatusLabel(product.status)}
                    </span>
                  </div>
                  <form
                    action={`/api/products/${product.id}/toggle`}
                    method="post"
                    className="absolute right-4 top-4"
                  >
                    <button className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold text-white">
                      {product.status === "ACTIVE" ? "下架" : "上架"}
                    </button>
                  </form>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h3
                        className={index === 2 ? "font-heading text-xl font-bold text-muted" : "font-heading text-xl font-bold text-foreground"}
                      >
                        {product.name}
                      </h3>
                      <span className="font-heading text-lg font-extrabold tracking-tight text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="text-sm leading-7 text-muted">{product.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-[1rem] bg-card-soft p-3 text-sm text-muted">
                    <span>库存 {product.stock}</span>
                    <Link
                      href={`/merchant/products/${product.id}/edit`}
                      className="font-bold text-primary"
                    >
                      编辑
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <Link
          href="/merchant/products/new"
          className="fixed bottom-24 right-6 z-30 rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] px-5 py-4 font-heading text-sm font-bold text-white shadow-[0_12px_28px_rgba(176,38,4,0.25)] md:bottom-10 md:right-10"
        >
          新增商品
        </Link>
      </div>
    </MerchantWorkspaceShell>
  );
}
