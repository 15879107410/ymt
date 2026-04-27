import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const detailHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCX761Y2D0O6zKXLCnBgCJa8_agrce0ZcazGjDohNpr0xztksHFRlMj38_Qsz91cDBDgLdI4Q9Vk5OdVe2on8g4FCFfhbz9zjuUBJchE0HUW6-Btaxa2lfRJ7hubYKRJyEjrXSPmhLVmrwI4Nl-m2W8RAv4LvZbcpFGgCMGtqa7JM9mpvlLx_rI9Yeq2LhapcJRdVOUyYFQ9ocp5iw9QgzewjLAIZbueWesk-EKRVrMe_nnrWeZydPueNgESQhHmqrRKPJjnIGwY2A";
const merchantImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBTmEKSr_MjBvWgbseV5QlWGGmkFg7uxTHopTesWCBVCu2P9JGFHo3blkIauw2C8rnnG4q9VQrelRpQIN5BeK0YdWDt97l3Yss0TjSUlpqqczaIs2YRs1-HnJhdaP7rk4Xr9jLsxclWuWUX8HI5qjoUq8UZjMSkNSbUqZezMk-zijENiXie8iji4K3Yl3y946kr1kuTVYr8dYK9D3eH7V8YxwSwI_Wabdt7OZPlKkDbzr0OB5gFAvj1nTtQwEBfUMqCd0XSZ48HRHk";

// 商品详情页按 stitch/_2 的结构重排，固定顶部悬浮操作和底部购买条。
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      merchant: true,
    },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-24">
      <div className="fixed left-0 top-0 z-50 flex w-full justify-between p-4 md:hidden">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground shadow-[0_4px_20px_rgba(78,33,35,0.1)] backdrop-blur-md"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground shadow-[0_4px_20px_rgba(78,33,35,0.1)] backdrop-blur-md">
            <Heart size={18} />
          </button>
          <Link
            href="/orders"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground shadow-[0_4px_20px_rgba(78,33,35,0.1)] backdrop-blur-md"
          >
            <ShoppingBag size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl md:px-6 md:pt-24">
        <div className="relative h-[486px] w-full overflow-hidden shadow-[0_20px_40px_rgba(78,33,35,0.08)] md:h-[530px] md:rounded-[2rem]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${detailHeroImage})` }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 -mt-8 px-4 md:mt-8 md:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <section className="rounded-[2rem] bg-card p-6 shadow-[0_10px_30px_rgba(78,33,35,0.05)] md:col-span-8 md:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="pr-4">
                  <h1 className="font-heading text-3xl font-bold leading-tight tracking-[-0.03em] text-foreground md:text-5xl">
                    {product.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <span>{product.merchant.shopName}</span>
                    <span className="h-1 w-1 rounded-full bg-border-soft" />
                    <Star size={16} className="fill-[#f59e0b] text-[#f59e0b]" />
                    <span>4.9 (128 条评论)</span>
                  </div>
                </div>
                <p className="font-heading text-2xl font-extrabold tracking-[-0.04em] text-primary md:text-4xl">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="mt-8">
                <p className="text-base leading-relaxed text-muted md:text-lg">
                  {product.description}
                  当前页面视觉结构按照原型还原，保留精品商品详情的氛围。业务上仍然只接
                  MVP 下单，不做评论、收藏持久化或复杂规格计算。
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-card-soft px-4 py-2 text-sm font-semibold text-primary">
                  招牌
                </span>
                <span className="rounded-full bg-card-soft px-4 py-2 text-sm font-semibold text-primary">
                  人气商品
                </span>
                <span className="rounded-full bg-card-soft px-4 py-2 text-sm font-semibold text-primary">
                  库存 {product.stock}
                </span>
              </div>
            </section>

            <aside className="flex flex-col gap-6 md:col-span-4">
              <section className="relative overflow-hidden rounded-[2rem] bg-card-soft p-6 transition-colors duration-300">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  商家信息
                </h3>
                <div className="mt-4 flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-[1rem] bg-cover bg-center shadow-sm"
                    style={{ backgroundImage: `url(${merchantImage})` }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {product.merchant.shopName}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      <MapPin size={15} />
                      市中心区域
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] bg-card p-6 shadow-[0_10px_30px_rgba(78,33,35,0.05)]">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  加点什么
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded border-2 border-border-soft" />
                      <span className="text-foreground">额外松露油</span>
                    </div>
                    <span className="text-sm text-muted">+¥20.00</span>
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded border-2 border-border-soft" />
                      <span className="text-foreground">加烤鸡肉</span>
                    </div>
                    <span className="text-sm text-muted">+¥40.00</span>
                  </label>
                </div>

                <div className="mt-8 flex items-center justify-between rounded-full bg-card-soft p-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-heading text-lg font-bold">
                    1
                  </span>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
                    <Plus size={18} />
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-40 w-full bg-background/90 px-4 py-4 shadow-[0_-20px_40px_rgba(78,33,35,0.06)] backdrop-blur-2xl md:py-6">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <button className="hidden h-14 w-14 items-center justify-center rounded-full bg-card-strong text-primary shadow-[0_4px_15px_rgba(78,33,35,0.05)] md:flex">
            <Heart size={18} />
          </button>
          <Link
            href={`/checkout/${product.id}`}
            className="flex-1 rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] px-8 py-4 text-center font-heading text-lg font-bold text-white shadow-[0_8px_25px_rgba(176,38,4,0.25)]"
          >
            立即下单
          </Link>
        </div>
      </div>
    </div>
  );
}
