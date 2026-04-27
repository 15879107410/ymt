import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireConsumer } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

const grainBowlImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4mPCMFl8KaOA7eABRrGJzCXaGd6_OOCIFio3-G2yYhxtrXEOfgg5JxRo_rwNmMDP4JoS2qFdItlfrPDuB0BZBJ-XU_R8ZOmW7l8p7zy0N6Br0-IT8goJG3YAIr01uIppXPbNkqRFIsi48BqOlFKmqIaB01Y_HqjEEYRlBR9g3Rlt9Bq51c1qiaAcHowpmijZvz0F0iXMwItGM98nR-6DXPqDZJe4c2zhqckHcASfSN-PAVnSuODKPLyFgHd_AHmyuqYpsfy4Q7Qo";
const juiceImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCih4Ah4lfGUhwfETCMmApZum2yGAoSzbRShCdB2XUxM_zXZjaEsIo_i_nyUn0UiICPrRtVNnQDSkBslEmqIXY99BcW5JkzpH5WyDIq_tar1PVdZVe8OYL79L8UldSfFKUmDSZx90KvRU8DCVe_CfSK01JJP8JwL9n5BPFNTAE2oqTC78aOWbCcShXWizFrZ7V0EPIslfL7Aba605jDgn40n96UxiQgufnOIwY3lGjc5zMKJlYd_l6AVBe710SKwp6Z6G0lrCWHO5U";

// 确认订单页按 stitch/_1 的卡片顺序重排，保留当前真实表单提交流程。
export default async function CheckoutPage({ params }: CheckoutPageProps) {
  await requireConsumer();

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { merchant: true },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-card-strong"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-heading text-xl font-bold uppercase tracking-[-0.05em] text-primary">
            Urbanist
          </h1>
          <div className="h-10 w-10 rounded-full bg-card-strong" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-8 pt-28 md:px-8">
        <h2 className="mb-8 ml-2 font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
          确认订单
        </h2>

        <div className="space-y-6">
          <section className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-card p-6 shadow-[0_4px_20px_rgba(78,33,35,0.03)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-card-soft opacity-50" />
            <h3 className="relative z-10 font-heading text-xl font-bold text-foreground">
              订单详情
            </h3>

            <div className="relative z-10 flex items-center gap-4">
              <div
                className="h-20 w-20 shrink-0 rounded-[1rem] bg-cover bg-center shadow-sm"
                style={{ backgroundImage: `url(${grainBowlImage})` }}
              />
              <div className="flex-grow">
                <h4 className="text-lg font-bold text-foreground">{product.name}</h4>
                <p className="mt-1 text-sm font-medium text-muted">
                  商家：{product.merchant.shopName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm font-medium text-muted">数量: 1</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div
                className="h-20 w-20 shrink-0 rounded-[1rem] bg-cover bg-center shadow-sm"
                style={{ backgroundImage: `url(${juiceImage})` }}
              />
              <div className="flex-grow">
                <h4 className="text-lg font-bold text-foreground">平台订单快照</h4>
                <p className="mt-1 text-sm font-medium text-muted">
                  当前会把价格和数量写入订单明细
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatPrice(0)}</p>
                <p className="text-sm font-medium text-muted">说明项</p>
              </div>
            </div>
          </section>

          <form action="/api/orders" method="post" className="space-y-6">
            <input type="hidden" name="productId" value={product.id} />

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
                      />
                      <input
                        name="consigneePhone"
                        className="field-input"
                        placeholder="联系电话"
                      />
                      <input
                        name="consigneeAddress"
                        className="field-input"
                        placeholder="详细收货地址"
                      />
                      <input
                        name="quantity"
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="field-input"
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
                  <p className="text-sm font-medium text-muted">提交后直接创建订单</p>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3 rounded-[2rem] bg-card-soft p-6">
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>小计</span>
                <span>{formatPrice(product.price)}</span>
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
                <span>{formatPrice(product.price)}</span>
              </div>
            </section>

            <div className="pb-8 pt-4">
              <button className="w-full rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] py-5 font-heading text-lg font-bold text-white shadow-[0_8px_30px_rgba(176,38,4,0.2)]">
                立即下单 • {formatPrice(product.price)}
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
