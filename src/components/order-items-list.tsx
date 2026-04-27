import { formatPrice } from "@/lib/utils";

type OrderItemsListProps = {
  items: Array<{
    id: number;
    productNameSnapshot: string;
    quantity: number;
    lineAmount: number;
  }>;
};

// 订单商品列表在消费者端和商家端都会反复出现，所以抽成公共展示组件。
export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="rounded-[1.5rem] bg-card-soft p-5">
      <p className="text-sm font-bold text-muted">订单内容</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span>
              {item.productNameSnapshot} x {item.quantity}
            </span>
            <span className="font-bold">{formatPrice(item.lineAmount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
