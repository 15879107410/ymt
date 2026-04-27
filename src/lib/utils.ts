import { OrderStatus, ProductStatus, UserRole } from "@/generated/prisma/enums";

// 金额统一格式化成中文货币风格，避免页面里到处写重复逻辑。
export function formatPrice(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// 订单状态在页面上需要中文文案，这里统一维护映射。
export function getOrderStatusLabel(status: OrderStatus) {
  const statusMap: Record<OrderStatus, string> = {
    PENDING: "待处理",
    ACCEPTED: "已接单",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
  };

  return statusMap[status];
}

// 订单状态颜色用于页面徽标展示，让不同阶段一眼就能区分。
export function getOrderStatusTone(status: OrderStatus) {
  const toneMap: Record<OrderStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    ACCEPTED: "bg-sky-100 text-sky-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };

  return toneMap[status];
}

// 这里定义允许的订单状态流转，避免接口被随意改成不合理状态。
export function canTransitionOrderStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
) {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  return transitions[currentStatus].includes(nextStatus);
}

// 商品状态在页面上也要显示中文，这里统一做映射。
export function getProductStatusLabel(status: ProductStatus) {
  const statusMap: Record<ProductStatus, string> = {
    DRAFT: "草稿",
    ACTIVE: "已上架",
    INACTIVE: "已下架",
  };

  return statusMap[status];
}

// 商品状态颜色和订单状态一样集中管理，页面里就不需要到处手写颜色判断。
export function getProductStatusTone(status: ProductStatus) {
  const toneMap: Record<ProductStatus, string> = {
    DRAFT: "bg-amber-100 text-amber-700",
    ACTIVE: "bg-emerald-100 text-emerald-700",
    INACTIVE: "bg-slate-200 text-slate-700",
  };

  return toneMap[status];
}

// 顶部导航根据角色显示不同入口，所以需要角色文案。
export function getRoleLabel(role: UserRole) {
  const roleMap: Record<UserRole, string> = {
    MERCHANT: "商家",
    CONSUMER: "消费者",
  };

  return roleMap[role];
}

// 订单号用时间戳生成，够当前 MVP 使用，也方便人工识别。
export function createOrderNo() {
  return `YMT${Date.now()}`;
}
