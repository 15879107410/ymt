import Link from "next/link";
import { MapPin, Star } from "lucide-react";

type MerchantSummaryCardProps = {
  title: string;
  subtitle: string;
  href?: string;
};

// 商家信息卡在首页和商品详情页都会复用，所以单独抽成组件。
export function MerchantSummaryCard({
  title,
  subtitle,
  href,
}: MerchantSummaryCardProps) {
  const content = (
    <div className="surface-card rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xl font-extrabold">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
        </div>
        <div className="rounded-full bg-card-soft p-3 text-primary">
          <Star size={18} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted">
        <MapPin size={16} />
        上海市静安区南京西路 1234 号
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
