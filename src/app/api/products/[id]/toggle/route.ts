import { NextResponse } from "next/server";
import { requireMerchant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ToggleProductRouteProps = {
  params: Promise<{ id: string }>;
};

// 商品上下架接口只切换当前商品状态，不修改其他字段。
export async function POST(
  request: Request,
  { params }: ToggleProductRouteProps,
) {
  const user = await requireMerchant();
  const { id } = await params;

  const merchant = await prisma.merchantProfile.findUnique({
    where: { userId: user.id },
  });

  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
      merchantId: merchant?.id ?? -1,
    },
  });

  if (!product) {
    return NextResponse.redirect(new URL("/merchant/products", request.url));
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      status: product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });

  return NextResponse.redirect(new URL("/merchant/products?status=toggled", request.url));
}
