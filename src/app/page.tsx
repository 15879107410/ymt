import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Clock3,
  Coffee,
  Heart,
  Leaf,
  Search,
  ShoppingBasket,
  Star,
  Utensils,
} from "lucide-react";
import { FlashBanner } from "@/components/flash-banner";
import { prisma } from "@/lib/prisma";

import { FilterPanel } from "@/components/filter-panel";

type HomePageProps = {
  searchParams: Promise<{
    status?: string;
    sort?: string;
  }>;
};

const prototypeImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBros22OJiOp0D7K3JRhLAeEGy3IQ0_T5bGb7k1RtXzHfGj-ideuGqt7DBqtFjqjFJkwjVohGfO95mnEWAL5QgmYHcoZl9dPLXMSs42QiSSwkKilSgxqIFP6dmrsqoKwiXxheQsr709x8VaD0h8McyPIZVXr4xKrmKoU84F8YjEnC6I25wSdiz-3785ruq773s-h__Y9RqKL4LbYRnPrdX8VbHVfLvMzq7oAiu6IDe7ffIgKm1_6LHa-1c0YveEg9EPmjEOHPgbhts",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA29vWs2TX-8U2TjKz-1cM_Gf_pc0TdmKKK-cen-h7FLbERQap7ngkLCYxg1JrhjizF8f9C94euP8xVDsWeQodGdmBAhqqwBWzzXKfDqEGDilm5s_nJnO6cix0rTGYLdYbU_g9G64pKorD3FVK3PIUC_10w3z9t2__lHEDKZBDJwEqDw_oFjXiqj9JVNnVqusnazrnmB-bBiRzTUelzSqWPPeUsUdVmXaan6PjzlJRn2BLWcR_fQyiwJqcVT8IM5YSh2SfGmWc2P8s",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9AlUs1NqZUYnob44XUjrZhH0qtoipWo9A3Q3vA7eZ8j4d2v6yig-XLk-BZTReGuXUolz4krKprLD5-TT_rhiUp4Vvdq662mRqoYVRucadvGaz4nJ6M56HtITUApFFOJKA0Y7ybyGX7naQFHA221QABM4DAFva0WpxhqlNSRaJrcXwHSnI9tidAv6KXsLYMsIMzbHg0U52GAcD4xfd55n9IE20Tu5YF354FlL4HuMK_t1pXaa0pOiGi4pm9GwVHgEv_VCTLv8Wh8",
] as const;

const prototypeCards = [
  {
    title: "乡村工坊",
    description: "木火烹饪体验和手工切割。",
    price: "$$$",
    rating: "4.9",
    metaIcon: Clock3,
    eta: "25-35 分钟",
    deliveryFee: "¥20",
    badge: "尊享",
  },
  {
    title: "光芒烘焙",
    description: "单一产地手冲和精致糕点。",
    price: "$$",
    rating: "4.8",
    metaIcon: Bike,
    eta: "15-20 分钟",
    deliveryFee: "免配送费",
  },
  {
    title: "翠绿沙拉",
    description: "当地采购的有机沙拉和健康饮品。",
    price: "$$",
    rating: "4.7",
    metaIcon: Clock3,
    eta: "20-30 分钟",
    deliveryFee: "¥10",
  },
] as const;

// 首页现在按 stitch/_4 的移动端原型一比一靠拢，商品链接仍然接真实 MVP 数据。
export default async function HomePage({ searchParams }: HomePageProps) {
  const { status, sort } = await searchParams;

  // 根据 sort 参数决定排序方式。
  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const featuredProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      merchant: true,
    },
    orderBy,
    take: 6,
  });

  const displayProducts = featuredProducts.slice(0, 3);
  const categoryItems = [
    { label: "美食", icon: Utensils, tone: "text-primary" },
    { label: "咖啡", icon: Coffee, tone: "text-tertiary" },
    { label: "超市", icon: ShoppingBasket, tone: "text-primary" },
    { label: "健康", icon: Leaf, tone: "text-primary" },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-[390px] pb-32">
      <section className="px-6">
        {status === "validation" && (
          <div className="mb-6">
            <FlashBanner
              tone="info"
              title="信息还没填完整"
              description="下单时请把收货人、电话、地址和数量填写完整后再提交。"
            />
          </div>
        )}
        {status === "inventory" && (
          <div className="mb-6">
            <FlashBanner
              tone="error"
              title="当前库存不足"
              description="这个商品可能已经下架或库存不够，请回到列表重新选择。"
            />
          </div>
        )}

        <div>
          <h1 className="font-heading text-[3.5rem] font-bold leading-[1.1] tracking-[-0.04em] text-foreground">
            早安，
            <br />
            <span className="text-primary">Sarah.</span>
          </h1>
          <p className="mb-8 mt-2 text-base text-muted">
            今天在市中心想吃点什么？
          </p>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6 text-primary">
              <Search size={21} />
            </div>
            <input
              className="block w-full rounded-[3rem] bg-card-soft py-5 pl-16 pr-20 text-lg text-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none placeholder:text-muted/55"
              placeholder="搜索美食、杂货、水疗..."
              readOnly
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <FilterPanel currentSort={sort} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            探索精选
          </h2>
          <Link
            href="/auth"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary"
          >
            查看全部
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
          {categoryItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={`/category/${encodeURIComponent(item.label)}`}
                className="flex min-w-[5rem] shrink-0 flex-col items-center gap-3"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-card shadow-[0_8px_20px_rgba(78,33,35,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(78,33,35,0.08)]">
                  <Icon className={item.tone} size={30} />
                </div>
                <span className="text-sm font-medium text-muted">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-foreground">
              编辑精选
            </p>
          </div>
          <Link
            href="/merchant"
            className="text-xs font-semibold uppercase tracking-widest text-muted"
          >
            在您附近
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-[2rem] bg-card p-8 text-center shadow-[0_12px_40px_rgba(78,33,35,0.05)]">
            <p className="font-heading text-3xl font-extrabold">当前还没有上架商品</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              先用商家账号进入后台添加并上架商品，消费者端这里才会显示列表。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {displayProducts.map((product, index) => {
              const card = prototypeCards[index] ?? prototypeCards[0];
              const MetaIcon = card.metaIcon;

              return (
              <Link
                key={product.id}
                href={`/merchants/${product.merchant.id}`}
                className="group relative overflow-hidden rounded-[2rem] bg-card shadow-[0_12px_40px_rgba(78,33,35,0.05)]"
              >
                <div className={index === 0 ? "relative h-[260px] overflow-hidden" : "relative h-48 overflow-hidden"}>
                  <div
                    aria-label={card.title}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${prototypeImages[index] ?? prototypeImages[0]})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
                      <Star size={14} fill="currentColor" />
                      {card.rating}
                    </span>
                    {"badge" in card && card.badge ? (
                      <span className="rounded-full bg-tertiary px-3 py-1.5 text-xs font-bold text-white">
                        {card.badge}
                      </span>
                    ) : null}
                  </div>
                  {index === 0 ? (
                    <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-muted backdrop-blur-sm">
                      <Heart size={20} fill="currentColor" />
                    </button>
                  ) : null}
                </div>

                <div className={index === 0 ? "relative -mt-4 rounded-t-[2rem] bg-card p-6" : "relative bg-card p-5"}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={index === 0 ? "font-heading text-2xl font-bold text-foreground" : "font-heading text-xl font-bold text-foreground"}>
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {card.description}
                      </p>
                    </div>
                    <span className={index === 0 ? "font-heading text-xl font-bold text-foreground" : "font-heading text-lg font-bold text-muted"}>
                      {card.price}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-[1rem] bg-card-soft p-3 text-xs font-medium text-muted">
                    <MetaIcon size={16} className="text-primary" />
                    <span>预计送达 {card.eta}</span>
                    <span className="h-1 w-1 rounded-full bg-border-soft" />
                    <span className="ml-auto text-primary">
                      配送费 {card.deliveryFee}
                    </span>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
