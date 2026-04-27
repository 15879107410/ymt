import { hashSync } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { ProductStatus, UserRole } from "../src/generated/prisma/enums";

const prisma = new PrismaClient();

async function main() {
  // 先清空旧数据，确保每次种子结果都稳定可预期。
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.merchantProfile.deleteMany();
  await prisma.user.deleteMany();

  // 创建一个演示商家账号，方便一启动就能看到商家端页面。
  const merchantUser = await prisma.user.create({
    data: {
      username: "merchant-demo",
      passwordHash: hashSync("123456", 10),
      role: UserRole.MERCHANT,
      merchantProfile: {
        create: {
          shopName: "Lumiere Kitchen",
          contactName: "林店长",
          contactPhone: "13800000001",
          address: "上海市静安区南京西路 1234 号",
          description: "主打轻奢感餐饮与精选甜品的本地生活店铺。",
          coverImageUrl: "",
        },
      },
    },
    include: {
      merchantProfile: true,
    },
  });

  // 创建一个演示消费者账号，方便直接走下单和订单查看链路。
  const consumerUser = await prisma.user.create({
    data: {
      username: "consumer-demo",
      passwordHash: hashSync("123456", 10),
      role: UserRole.CONSUMER,
    },
  });

  const merchantId = merchantUser.merchantProfile!.id;

  // 预置几条商品数据，让首页和商品详情页不至于空白。
  await prisma.product.create({
    data: {
      merchantId,
      name: "黑松露蘑菇烩饭",
      description: "奶香浓郁、口感顺滑的招牌烩饭，适合作为首页主打商品。",
      price: 88,
      stock: 18,
      status: ProductStatus.ACTIVE,
    },
  });

  const grainBowl = await prisma.product.create({
    data: {
      merchantId,
      name: "手作杂粮碗",
      description: "轻食型商品，用来展示多品类商品卡片和下单流程。",
      price: 32,
      stock: 35,
      status: ProductStatus.ACTIVE,
    },
  });

  const juice = await prisma.product.create({
    data: {
      merchantId,
      name: "绿色鲜榨果汁",
      description: "用于确认订单页和订单列表页演示的小体量单品。",
      price: 18,
      stock: 42,
      status: ProductStatus.ACTIVE,
    },
  });

  // 插入一张历史订单，让消费者和商家端打开就能看到订单数据。
  const demoOrder = await prisma.order.create({
    data: {
      orderNo: `YMT${Date.now()}`,
      consumerId: consumerUser.id,
      merchantId,
      totalAmount: 50,
      consigneeName: "张三",
      consigneePhone: "13800000002",
      consigneeAddress: "上海市徐汇区宜山路 88 号",
      items: {
        create: [
          {
            productId: grainBowl.id,
            productNameSnapshot: grainBowl.name,
            productImageSnapshot: grainBowl.imageUrl,
            unitPrice: 32,
            quantity: 1,
            lineAmount: 32,
          },
          {
            productId: juice.id,
            productNameSnapshot: juice.name,
            productImageSnapshot: juice.imageUrl,
            unitPrice: 18,
            quantity: 1,
            lineAmount: 18,
          },
        ],
      },
    },
  });

  console.log("Seed completed:", {
    merchantUser: merchantUser.username,
    consumerUser: consumerUser.username,
    orderId: demoOrder.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
