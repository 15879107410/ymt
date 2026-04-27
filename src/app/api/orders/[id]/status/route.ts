import { NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma/enums";
import { requireMerchant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransitionOrderStatus } from "@/lib/utils";

type OrderStatusRouteProps = {
  params: Promise<{ id: string }>;
};

// 商家订单状态更新接口只允许修改自己店铺对应的订单。
export async function POST(
  request: Request,
  { params }: OrderStatusRouteProps,
) {
  const user = await requireMerchant();
  const { id } = await params;
  const formData = await request.formData();
  const nextStatus = String(formData.get("status") ?? "") as OrderStatus;

  const merchant = await prisma.merchantProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!merchant) {
    return NextResponse.redirect(new URL("/merchant/profile", request.url));
  }

  const order = await prisma.order.findFirst({
    where: {
      id: Number(id),
      merchantId: merchant.id,
    },
  });

  if (!order) {
    return NextResponse.redirect(new URL("/merchant/orders?status=notfound", request.url));
  }

  // 如果状态值非法，或者当前状态不允许跳到目标状态，就直接提示而不是硬改。
  if (
    !["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"].includes(nextStatus) ||
    !canTransitionOrderStatus(order.status, nextStatus)
  ) {
    return NextResponse.redirect(new URL("/merchant/orders?status=invalid", request.url));
  }

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      status: nextStatus,
    },
  });

  return NextResponse.redirect(new URL("/merchant/orders?status=updated", request.url));
}
