import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MerchantProductList from "@/components/merchant-product-list";

type MerchantMenuPageProps = {
  params: Promise<{ id: string }>;
};

const merchantHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBTmEKSr_MjBvWgbseV5QlWGGmkFg7uxTHopTesWCBVCu2P9JGFHo3blkIauw2C8rnnG4q9VQrelRpQIN5BeK0YdWDt97l3Yss0TjSUlpqqczaIs2YRs1-HnJhdaP7rk4Xr9jLsxclWuWUX8HI5qjoUq8UZjMSkNSbUqZezMk-zijENiXie8iji4K3Yl3y946kr1kuTVYr8dYK9D3eH7V8YxwSwI_Wabdt7OZPlKkDbzr0OB5gFAvj1nTtQwEBfUMqCd0XSZ48HRHk";

// 商家菜单页补齐 stitch/_5 的浏览流转，让首页先进入商家，再进入商品详情。
export default async function MerchantMenuPage({
  params,
}: MerchantMenuPageProps) {
  const { id } = await params;

  const merchant = await prisma.merchantProfile.findUnique({
    where: { id: Number(id) },
    include: {
      products: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!merchant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-xl">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-[0_4px_20px_rgba(78,33,35,0.08)]"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-heading text-xl font-extrabold tracking-[-0.05em] text-primary">
          L&apos;Artisan 厨房
        </h1>
        <Link
          href="/orders"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card-soft text-primary"
          aria-label="查看订单"
        >
          <ShoppingBag size={16} />
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-background bg-tertiary" />
        </Link>
      </header>

      <main className="mx-auto max-w-[430px] px-6 pb-24 pt-24">
        <section className="mb-8">
          <div
            className="h-56 rounded-[2rem] bg-cover bg-center shadow-[0_12px_40px_rgba(78,33,35,0.08)]"
            style={{ backgroundImage: `url(${merchantHeroImage})` }}
          />
          <h2 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-foreground">
            {merchant.shopName || "商家店铺"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            {merchant.description || "暂无简介"}
          </p>
        </section>

        <MerchantProductList
          merchantName={merchant.shopName}
          merchantDescription={merchant.description}
          products={merchant.products}
        />
      </main>
    </div>
  );
}
