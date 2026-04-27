import { NextResponse } from "next/server";
import { ProductStatus } from "@/generated/prisma/enums";
import { requireMerchant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

// 新增商品接口只允许商家访问，并且商品必须归属于当前商家。
export async function POST(request: Request) {
  const user = await requireMerchant();
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
      new URL("/merchant/products/new?status=validation", request.url),
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

  await prisma.product.create({
    data: {
      merchantId: merchant.id,
      ...parsed.data,
      status: parsed.data.status as ProductStatus,
    },
  });

  return NextResponse.redirect(new URL("/merchant/products?status=created", request.url));
}
