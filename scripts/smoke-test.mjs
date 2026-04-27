import { execFileSync } from "node:child_process";

const baseUrl = "http://localhost:3000";

// 从响应头里提取 session cookie，方便脚本继续访问受保护接口。
function extractCookie(response) {
  const setCookie = response.headers.get("set-cookie");

  if (!setCookie) {
    throw new Error("登录响应里没有拿到 set-cookie。");
  }

  return setCookie.split(";")[0];
}

// 统一处理 form 提交，避免后面每一步都重复写 fetch 配置。
async function postForm(path, formData, cookie) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      ...(cookie ? { cookie } : {}),
    },
    body: new URLSearchParams(formData).toString(),
  });

  return response;
}

// 读取 sqlite 中的订单状态，用来确认接口行为真的落库。
function readOrderStatus(orderId) {
  const output = execFileSync(
    "sqlite3",
    [
      "/Users/hlstart/Ysport/PROJECT/ymt/prisma/dev.db",
      `select status from "Order" where id=${orderId};`,
    ],
    {
      encoding: "utf8",
    },
  ).trim();

  return output;
}

async function main() {
  console.log("1. 登录消费者账号");
  const consumerLoginResponse = await postForm("/api/auth/login", {
    username: "consumer-demo",
    password: "123456",
  });

  const consumerCookie = extractCookie(consumerLoginResponse);

  console.log("2. 消费者创建订单");
  const createOrderResponse = await postForm(
    "/api/orders",
    {
      productId: "1",
      quantity: "1",
      consigneeName: "自动化测试用户",
      consigneePhone: "13800008888",
      consigneeAddress: "上海市徐汇区自动化路 9 号",
    },
    consumerCookie,
  );

  const orderRedirect = createOrderResponse.headers.get("location");

  if (!orderRedirect?.includes("/orders?status=created")) {
    throw new Error(`下单后跳转不符合预期：${orderRedirect}`);
  }

  const createdOrderId = Number(
    execFileSync(
      "sqlite3",
      [
        "/Users/hlstart/Ysport/PROJECT/ymt/prisma/dev.db",
        'select id from "Order" order by id desc limit 1;',
      ],
      {
        encoding: "utf8",
      },
    ).trim(),
  );

  if (!createdOrderId) {
    throw new Error("没有拿到新订单 id。");
  }

  console.log(`3. 登录商家账号，准备处理订单 #${createdOrderId}`);
  const merchantLoginResponse = await postForm("/api/auth/login", {
    username: "merchant-demo",
    password: "123456",
  });

  const merchantCookie = extractCookie(merchantLoginResponse);

  console.log("4. 商家接单");
  const merchantUpdateResponse = await postForm(
    `/api/orders/${createdOrderId}/status`,
    {
      status: "ACCEPTED",
    },
    merchantCookie,
  );

  const merchantRedirect = merchantUpdateResponse.headers.get("location");

  if (!merchantRedirect?.includes("/merchant/orders?status=updated")) {
    throw new Error(`商家更新订单后的跳转不符合预期：${merchantRedirect}`);
  }

  const finalStatus = readOrderStatus(createdOrderId);

  if (finalStatus !== "ACCEPTED") {
    throw new Error(`订单状态没有成功更新，当前值：${finalStatus}`);
  }

  console.log("Smoke test passed:");
  console.log(`- 新订单 ID: ${createdOrderId}`);
  console.log(`- 最终状态: ${finalStatus}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
