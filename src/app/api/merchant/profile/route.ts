import { NextResponse } from "next/server";
import { requireMerchant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { merchantProfileSchema } from "@/lib/validations";

// 商家资料接口同时承担“首次完善资料”和“后续更新资料”两种场景。
export async function POST(request: Request) {
  const user = await requireMerchant();
  const formData = await request.formData();

  const parsed = merchantProfileSchema.safeParse({
    shopName: formData.get("shopName"),
    contactName: formData.get("contactName"),
    contactPhone: formData.get("contactPhone"),
    address: formData.get("address"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/merchant/profile?status=validation", request.url),
    );
  }

  const payload = parsed.data;
  const merchant = await prisma.merchantProfile.findUnique({
    where: { userId: user.id },
  });

  if (merchant) {
    await prisma.merchantProfile.update({
      where: { userId: user.id },
      data: payload,
    });
  } else {
    await prisma.merchantProfile.create({
      data: {
        userId: user.id,
        ...payload,
      },
    });
  }

  return NextResponse.redirect(new URL("/merchant/profile?status=saved", request.url));
}
