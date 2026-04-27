"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type MerchantProductListProps = {
  merchantName: string;
  merchantDescription: string;
  products: Product[];
};

// 商家菜单页的商品列表客户端组件，负责购物车状态管理和交互。
export default function MerchantProductList({
  products,
}: MerchantProductListProps) {
  const router = useRouter();

  // 购物车状态：{ 商品ID -> 数量 }
  const [cart, setCart] = useState<Record<number, number>>({});

  // 增加商品数量，不能超过库存。
  const increase = useCallback(
    (product: Product) => {
      setCart((prev) => {
        const current = prev[product.id] || 0;
        if (current >= product.stock) return prev;
        return { ...prev, [product.id]: current + 1 };
      });
    },
    [setCart],
  );

  // 减少商品数量，减到 0 时从购物车中移除该商品。
  const decrease = useCallback(
    (productId: number) => {
      setCart((prev) => {
        const current = prev[productId] || 0;
        if (current <= 1) {
          const next = { ...prev };
          delete next[productId];
          return next;
        }
        return { ...prev, [productId]: current - 1 };
      });
    },
    [setCart],
  );

  // 计算购物车中商品的总件数。
  const totalCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // 计算购物车中商品的总金额。
  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product?.price || 0) * qty;
  }, 0);

  // 点击底部结算栏，把购物车数据编码后跳转到确认订单页。
  const handleCheckout = () => {
    if (totalCount === 0) return;

    const items = Object.entries(cart).map(([id, qty]) => ({
      productId: Number(id),
      quantity: qty,
    }));

    const query = new URLSearchParams();
    query.set("items", encodeURIComponent(JSON.stringify(items)));

    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <>
      <section>
        <h3 className="mb-4 border-l-4 border-primary pl-2 font-heading text-xl font-bold text-foreground">
          招牌推荐
        </h3>

        <div className="space-y-4">
          {products.map((product) => {
            const count = cart[product.id] || 0;

            return (
              <article
                key={product.id}
                className="flex items-center gap-4 rounded-[2rem] bg-card p-4 shadow-[0_8px_30px_rgba(78,33,35,0.04)]"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <div className="h-24 w-24 shrink-0 rounded-[1.25rem] bg-[linear-gradient(135deg,#240305,#803f9e,#ff7859)]" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading text-base font-bold leading-tight text-foreground">
                      {product.name}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                      {product.description}
                    </p>
                    <p className="mt-3 font-heading text-lg font-bold tracking-tight text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>

                <div className="flex flex-col items-end justify-between gap-4 self-stretch">
                  <Link
                    href={`/products/${product.id}`}
                    aria-label={`查看${product.name}详情`}
                  >
                    <ChevronRight size={18} className="mt-2 text-muted" />
                  </Link>
                  <div className="flex items-center gap-2 rounded-full bg-card-soft px-2 py-2">
                    {count > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => decrease(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-primary shadow-[0_4px_12px_rgba(78,33,35,0.06)]"
                          aria-label={`减少${product.name}数量`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-foreground">
                          {count}
                        </span>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => increase(product)}
                      disabled={count >= product.stock}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] text-white shadow-[0_6px_14px_rgba(176,38,4,0.22)] disabled:opacity-40"
                      aria-label={`增加${product.name}数量`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 底部购物车汇总栏 */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={totalCount === 0}
        className="fixed bottom-6 left-1/2 z-[100] flex w-[calc(100%-3rem)] max-w-[382px] -translate-x-1/2 cursor-pointer items-center justify-between rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] px-6 py-4 text-white shadow-[0_12px_28px_rgba(176,38,4,0.25)] transition-all duration-150 hover:shadow-[0_16px_36px_rgba(176,38,4,0.35)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <ShoppingBag size={18} />
            {totalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-primary shadow-sm">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold">
            已选 {totalCount} 件商品
          </span>
        </div>
        <span className="font-heading text-lg font-bold">
          {formatPrice(totalAmount)}
        </span>
      </button>
    </>
  );
}
