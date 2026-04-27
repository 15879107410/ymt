import Link from "next/link";
import type { Product } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

// 商品卡片是消费者首页和商家列表页最常用的展示单元。
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="surface-card group flex h-full flex-col overflow-hidden rounded-[2rem]"
    >
      <div className="h-64 bg-[linear-gradient(135deg,#240305,#b02604,#ff7859)] p-6 text-white">
        <div className="flex h-full flex-col justify-between rounded-[1.75rem] bg-black/10 p-5 backdrop-blur-sm">
          <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
            热门商品
          </span>
          <div>
            <p className="font-heading text-2xl font-extrabold tracking-[-0.03em]">
              {product.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/80 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="-mt-5 flex flex-1 flex-col rounded-t-[2rem] bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="font-heading text-2xl font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>
          <span className="pill">库存 {product.stock}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          平台内下单，当前版本不接真实支付，提交订单后进入订单列表即可查看状态。
        </p>
        <div className="mt-6 inline-flex w-fit rounded-full gradient-brand px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(176,38,4,0.25)] transition-transform duration-300 group-hover:-translate-y-1">
          查看详情
        </div>
      </div>
    </Link>
  );
}
