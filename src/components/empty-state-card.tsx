import Link from "next/link";

type EmptyStateCardProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

// 空状态卡片统一处理“当前没有数据”时的展示和行动入口。
export function EmptyStateCard({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateCardProps) {
  return (
    <div className="surface-card rounded-[2rem] p-8 text-center">
      <p className="font-heading text-3xl font-extrabold">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex rounded-full px-5 py-3 text-sm font-bold text-white gradient-brand"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
