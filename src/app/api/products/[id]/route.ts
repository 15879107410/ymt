import { NextResponse } from "next/server";
import { ProductStatus } from "@/generated/prisma/enums";
import { requireMerchant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

type ProductRouteProps = {
  params: Promise<{ id: string }>;
};

// 编辑商品接口会先校验归属，防止修改到别人的商品。
export async function POST(request: Request, { params }: ProductRouteProps) {
  const user = await requireMerchant();
  const { id } = await params;
  const formData = await request.formData();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL(`/merchant/products/${id}/edit?status=validation`, request.url),
    );
  }

  const merchant = await prisma.merchantProfile.findUnique({
    where: { userId: user.id },
  });

  if (!merchant) {
    return NextResponse.redirect(
      new URL("/merchant/profile?status=validation", request.url),
    );
  }

  await prisma.product.updateMany({
    where: {
      id: Number(id),
      merchantId: merchant.id,
    },
    data: {
      ...parsed.data,
      status: parsed.data.status as ProductStatus,
    },
  });

  return NextResponse.redirect(new URL("/merchant/products?status=updated", request.url));
}
