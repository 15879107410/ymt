import { OrderStatus } from "@/generated/prisma/enums";
import { getOrderStatusLabel, getOrderStatusTone } from "@/lib/utils";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

// 订单状态徽标统一封装，避免页面里重复拼接颜色和文案。
export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusTone(status)}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}
