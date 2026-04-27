import { NextResponse } from "next/server";
import { requireConsumer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrderNo } from "@/lib/utils";
import { z } from "zod";

// 单条购物车项的校验规则。
const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1),
});

// 多商品订单的收货信息校验。
const multiOrderSchema = z.object({
  items: z.string().min(1),
  consigneeName: z.string().trim().min(2, "收货人不能为空"),
  consigneePhone: z.string().trim().min(6, "联系电话不能为空"),
  consigneeAddress: z.string().trim().min(4, "收货地址不能为空"),
});

// 创建订单时需要同时扣库存和写订单快照，所以这里使用事务保持一致性。
// 当前支持两种模式：
// 1. 单商品下单（向后兼容，通过 productId + quantity 字段）
// 2. 多商品购物车下单（通过 items JSON 数组字段）
export async function POST(request: Request) {
  const user = await requireConsumer();
  const formData = await request.formData();

  // 先尝试按多商品模式解析（items 字段优先）。
  const itemsRaw = formData.get("items");

  if (itemsRaw && typeof itemsRaw === "string") {
    // 多商品购物车模式。
    const parsed = multiOrderSchema.safeParse({
      items: itemsRaw,
      consigneeName: formData.get("consigneeName"),
      consigneePhone: formData.get("consigneePhone"),
      consigneeAddress: formData.get("consigneeAddress"),
    });

    if (!parsed.success) {
      return NextResponse.redirect(
        new URL("/?status=validation", request.url),
      );
    }

    let cartItems: Array<{ productId: number; quantity: number }>;
    try {
      cartItems = JSON.parse(parsed.data.items) as Array<{
        productId: number;
        quantity: number;
      }>;
    } catch {
      return NextResponse.redirect(
        new URL("/?status=validation", request.url),
      );
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.redirect(
        new URL("/?status=validation", request.url),
      );
    }

    // 校验每个购物车项的格式。
    const validItems = cartItems
      .map((item) => cartItemSchema.safeParse(item))
      .filter((r) => r.success)
      .map((r) => r.data);

    if (validItems.length === 0) {
      return NextResponse.redirect(
        new URL("/?status=validation", request.url),
      );
    }

    // 查询所有商品，并校验库存。
    const productIds = validItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: "ACTIVE",
      },
      include: {
        merchant: true,
      },
    });

    if (products.length !== validItems.length) {
      return NextResponse.redirect(
        new URL("/?status=inventory", request.url),
      );
    }

    // 确保所有商品来自同一家商家。
    const merchantId = products[0].merchantId;
    if (products.some((p) => p.merchantId !== merchantId)) {
      return NextResponse.redirect(
        new URL("/?status=validation", request.url),
      );
    }

    // 校验每个商品的库存是否充足。
    for (const item of validItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.redirect(
          new URL("/?status=inventory", request.url),
        );
      }
    }

    // 计算订单总金额。
    const totalAmount = validItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // 创建订单：事务内扣减所有商品库存并写入订单及订单明细。
    await prisma.$transaction(async (tx) => {
      // 扣减库存。
      for (const item of validItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 创建订单。
      await tx.order.create({
        data: {
          orderNo: createOrderNo(),
          consumerId: user.id,
          merchantId,
          totalAmount,
          consigneeName: parsed.data.consigneeName,
          consigneePhone: parsed.data.consigneePhone,
          consigneeAddress: parsed.data.consigneeAddress,
          items: {
            create: validItems.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                productNameSnapshot: product.name,
                productImageSnapshot: product.imageUrl,
                unitPrice: product.price,
                quantity: item.quantity,
                lineAmount: product.price * item.quantity,
              };
            }),
          },
        },
      });
    });

    return NextResponse.redirect(
      new URL("/orders?status=created", request.url),
    );
  }

  // 向后兼容：单商品下单模式（通过独立的 productId + quantity 字段）。
  const orderSchema = z.object({
    productId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().min(1),
    consigneeName: z.string().trim().min(2, "收货人不能为空"),
    consigneePhone: z.string().trim().min(6, "联系电话不能为空"),
    consigneeAddress: z.string().trim().min(4, "收货地址不能为空"),
  });

  const parsed = orderSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    consigneeName: formData.get("consigneeName"),
    consigneePhone: formData.get("consigneePhone"),
    consigneeAddress: formData.get("consigneeAddress"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/?status=validation", request.url),
    );
  }

  const payload = parsed.data;

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
    include: {
      merchant: true,
    },
  });

  if (!product || product.status !== "ACTIVE" || product.stock < payload.quantity) {
    return NextResponse.redirect(
      new URL("/?status=inventory", request.url),
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: product.id },
      data: {
        stock: {
          decrement: payload.quantity,
        },
      },
    });

    await tx.order.create({
      data: {
        orderNo: createOrderNo(),
        consumerId: user.id,
        merchantId: product.merchantId,
        totalAmount: product.price * payload.quantity,
        consigneeName: payload.consigneeName,
        consigneePhone: payload.consigneePhone,
        consigneeAddress: payload.consigneeAddress,
        items: {
          create: {
            productId: product.id,
            productNameSnapshot: product.name,
            productImageSnapshot: product.imageUrl,
            unitPrice: product.price,
            quantity: payload.quantity,
            lineAmount: product.price * payload.quantity,
          },
        },
      },
    });
  });

  return NextResponse.redirect(
    new URL("/orders?status=created", request.url),
  );
}
