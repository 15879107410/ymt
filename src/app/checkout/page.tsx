import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireConsumer } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

type CheckoutPageProps = {
  searchParams: Promise<{ items?: string }>;
};

type CartItem = {
  productId: number;
  quantity: number;
};

// 多商品确认订单页，接收购物车数据后展示所有选中商品并支持统一提交。
export default async function MultiCheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  await requireConsumer();

  const { items: itemsRaw } = await searchParams;

  if (!itemsRaw) {
    redirect("/");
  }

  let cartItems: CartItem[];
  try {
    cartItems = JSON.parse(decodeURIComponent(itemsRaw)) as CartItem[];
  } catch {
    redirect("/");
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    redirect("/");
  }

  // 查询所有购物车中的商品，并校验库存。
  const productIds = cartItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE",
    },
    include: {
      merchant: true,
    },
  });

  // 如果有的商品找不到或已下架，直接跳回首页。
  if (products.length !== cartItems.length) {
    redirect("/");
  }

  // 构建购物车条目详情，同时校验库存。
  const cartDetails = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) return null;
      return {
        product,
        quantity: item.quantity,
        lineAmount: product.price * item.quantity,
      };
    })
    .filter(Boolean) as Array<{
    product: (typeof products)[0];
    quantity: number;
    lineAmount: number;
  }>;

  if (cartDetails.length === 0) {
    redirect("/");
  }

  const merchant = cartDetails[0].product.merchant;
  const totalAmount = cartDetails.reduce(
    (sum, item) => sum + item.lineAmount,
    0,
  );

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-card-strong"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-heading text-xl font-bold uppercase tracking-[-0.05em] text-primary">
            {merchant.shopName}
          </h1>
          <div className="h-10 w-10 rounded-full bg-card-strong" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-8 pt-28 md:px-8">
        <h2 className="mb-8 ml-2 font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
          确认订单
        </h2>

        <div className="space-y-6">
          {/* 订单商品列表 */}
          <section className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-card p-6 shadow-[0_4px_20px_rgba(78,33,35,0.03)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-card-soft opacity-50" />
            <h3 className="relative z-10 font-heading text-xl font-bold text-foreground">
              订单详情
            </h3>

            {cartDetails.map(({ product, quantity, lineAmount }) => (
              <div
                key={product.id}
                className="relative z-10 flex items-center gap-4"
              >
                <div className="h-20 w-20 shrink-0 rounded-[1rem] bg-[linear-gradient(135deg,#240305,#803f9e,#ff7859)] shadow-sm" />
                <div className="flex-grow">
                  <h4 className="text-lg font-bold text-foreground">
                    {product.name}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-muted">
                    商家：{product.merchant.shopName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(lineAmount)}
                  </p>
                  <p className="text-sm font-medium text-muted">
                    数量: {quantity}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* 订单表单 */}
          <form action="/api/orders" method="post" className="space-y-6">
            {/* 把购物车商品数据以隐藏字段传递 */}
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(
                cartDetails.map((item) => ({
                  productId: item.product.id,
                  quantity: item.quantity,
                })),
              )}
            />

            <section className="flex flex-col gap-5 rounded-[2rem] bg-card p-6 shadow-[0_4px_20px_rgba(78,33,35,0.03)]">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  配送信息
                </h3>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  编辑
                </span>
              </div>

              <div className="rounded-[1rem] bg-card-soft p-4">
                <div className="mb-4 flex items-start gap-4">
                  <MapPin size={18} className="mt-1 text-primary" />
                  <div className="w-full">
                    <p className="mb-3 font-bold text-foreground">配送地址</p>
                    <div className="grid gap-4">
                      <input
                        name="consigneeName"
                        className="field-input"
                        placeholder="收货人姓名"
                        required
                      />
                      <input
                        name="consigneePhone"
                        className="field-input"
                        placeholder="联系电话"
                        required
                      />
                      <input
                        name="consigneeAddress"
                        className="field-input"
                        placeholder="详细收货地址"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-5 rounded-[2rem] bg-card p-6 shadow-[0_4px_20px_rgba(78,33,35,0.03)]">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  支付方式
                </h3>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  更改
                </span>
              </div>

              <div className="flex items-center gap-4 rounded-[1rem] bg-card-soft p-4">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-card-strong">
                  <span className="text-xl text-muted">💳</span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-foreground">当前不接真实支付</p>
                  <p className="text-sm font-medium text-muted">
                    提交后直接创建订单
                  </p>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3 rounded-[2rem] bg-card-soft p-6">
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>商品小计</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>配送费</span>
                <span>{formatPrice(0)}</span>
              </div>
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>税费</span>
                <span>{formatPrice(0)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-white/30 pt-4 font-heading text-xl font-bold text-primary">
                <span>合计</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </section>

            <div className="pb-8 pt-4">
              <button
                type="submit"
                className="w-full rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] py-5 font-heading text-lg font-bold text-white shadow-[0_8px_30px_rgba(176,38,4,0.2)]"
              >
                立即下单 • {formatPrice(totalAmount)}
              </button>
              <p className="mt-4 px-8 text-center text-xs font-medium text-muted">
                下单即表示您同意我们的服务条款和隐私政策。
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
