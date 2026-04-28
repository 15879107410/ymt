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
          shopName: "",
          contactName: "",
          contactPhone: "",
          address: "",
          description: "",
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
      category: "美食",
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
      category: "健康",
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
      category: "美食",
      status: ProductStatus.ACTIVE,
    },
  });

  // 补充更多分类商品，让首页筛选有数据可展示。
  await prisma.product.create({
    data: {
      merchantId,
      name: "意式浓缩咖啡",
      description: "深度烘焙阿拉比卡豆，油脂丰富，口感醇厚。",
      price: 28,
      stock: 50,
      category: "咖啡",
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.product.create({
    data: {
      merchantId,
      name: "燕麦拿铁",
      description: "植物基燕麦奶与浓缩咖啡的完美融合，丝滑顺口。",
      price: 32,
      stock: 40,
      category: "咖啡",
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.product.create({
    data: {
      merchantId,
      name: "有机全麦面包",
      description: "天然酵母发酵，无添加防腐剂，健康早餐首选。",
      price: 22,
      stock: 25,
      category: "超市",
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.product.create({
    data: {
      merchantId,
      name: "希腊酸奶",
      description: "高蛋白低糖，搭配水果坚果，营养均衡。",
      price: 16,
      stock: 30,
      category: "健康",
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.product.create({
    data: {
      merchantId,
      name: "进口矿泉水",
      description: "阿尔卑斯山天然矿泉水，弱碱性，口感清冽。",
      price: 12,
      stock: 100,
      category: "超市",
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
