import { requireMerchant } from "@/lib/auth";
import { EmptyStateCard } from "@/components/empty-state-card";
import { FlashBanner } from "@/components/flash-banner";
import { MerchantWorkspaceShell } from "@/components/merchant-workspace-shell";
import { prisma } from "@/lib/prisma";
import { canTransitionOrderStatus, formatPrice } from "@/lib/utils";

type MerchantOrdersPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const merchantOrderImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCBpO7GkxOq0wSD1Jzj-J06FbYTmep7X9SzkzHwphER9Cr4XEHq-VxDw-NHM-449kZTCrU2GyXGS9fYYuCzc6W_LWfuFDJVxyEHiHfkq6MZrvowo0Fgf9OAPfgJnRV4X_ZFgssWPW1B658rxrIjiXkS_YU4RP7ZeSz6IveD9rzdpFMi4EVIqIu4dGx2DSUtBkUWGwyjTyS3DS1_cPLvABA8yhD1ZM2gzMK0ux2ICWj4urKDekyVlJxoL0uulpEYeM7BsQZJxPdPac",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA29vWs2TX-8U2TjKz-1cM_Gf_pc0TdmKKK-cen-h7FLbERQap7ngkLCYxg1JrhjizF8f9C94euP8xVDsWeQodGdmBAhqqwBWzzXKfDqEGDilm5s_nJnO6cix0rTGYLdYbU_g9G64pKorD3FVK3PIUC_10w3z9t2__lHEDKZBDJwEqDw_oFjXiqj9JVNnVqusnazrnmB-bBiRzTUelzSqWPPeUsUdVmXaan6PjzlJRn2BLWcR_fQyiwJqcVT8IM5YSh2SfGmWc2P8s",
] as const;

// 商家订单页按 stitch/_10 的商家订单卡片风格重排，同时保留真实订单状态流转。
export default async function MerchantOrdersPage({
  searchParams,
}: MerchantOrdersPageProps) {
  const user = await requireMerchant();
  const { status } = await searchParams;

  const merchant = await prisma.merchantProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      merchantId: merchant?.id ?? -1,
    },
    include: {
      consumer: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <MerchantWorkspaceShell
      title="订单管理"
      description="管理并追踪您的精品店订单。"
      activePath="orders"
    >
      <div className="space-y-6">
        {status === "updated" && (
          <FlashBanner
            tone="success"
            title="订单状态已更新"
            description="你刚刚完成了接单、完成或取消操作，当前列表已经是最新结果。"
          />
        )}
        {status === "invalid" && (
          <FlashBanner
            tone="error"
            title="这个状态不能这样修改"
            description="例如已完成订单不能再接单，已取消订单也不能继续流转。"
          />
        )}
        {status === "notfound" && (
          <FlashBanner
            tone="error"
            title="没有找到对应订单"
            description="这条订单可能不属于当前商家，或者已经不存在。"
          />
        )}

        {orders.length === 0 ? (
          <EmptyStateCard
            title="还没有订单"
            description="等消费者完成下单后，新的订单就会出现在这里。"
          />
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8"
              >
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="flex gap-4">
                    <div
                      className="h-24 w-24 shrink-0 rounded-[1rem] bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${merchantOrderImages[index] ?? merchantOrderImages[0]})`,
                      }}
                    />
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground">
                        {order.items.map((item) => item.productNameSnapshot).join(" / ")}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        下单用户：{order.consumer.username}
                      </p>
                      <p className="text-sm text-muted">订单号：{order.orderNo}</p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-card-soft p-5">
                    <p className="text-xs text-muted">订单总额</p>
                    <p className="font-heading text-3xl font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <div className="mt-4 grid gap-3">
                      {canTransitionOrderStatus(order.status, "ACCEPTED") ? (
                        <form action={`/api/orders/${order.id}/status`} method="post">
                          <input type="hidden" name="status" value="ACCEPTED" />
                          <button className="w-full rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] px-5 py-3 text-sm font-bold text-white">
                            接单
                          </button>
                        </form>
                      ) : null}

                      {canTransitionOrderStatus(order.status, "COMPLETED") ? (
                        <form action={`/api/orders/${order.id}/status`} method="post">
                          <input type="hidden" name="status" value="COMPLETED" />
                          <button className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-bold text-white">
                            标记完成
                          </button>
                        </form>
                      ) : null}

                      {canTransitionOrderStatus(order.status, "CANCELLED") ? (
                        <form action={`/api/orders/${order.id}/status`} method="post">
                          <input type="hidden" name="status" value="CANCELLED" />
                          <button className="w-full rounded-full bg-card px-5 py-3 text-sm font-bold text-primary">
                            取消订单
                          </button>
                        </form>
                      ) : (
                        <div className="rounded-full bg-card px-5 py-3 text-center text-sm font-bold text-muted">
                          当前状态不可继续流转
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MerchantWorkspaceShell>
  );
}
