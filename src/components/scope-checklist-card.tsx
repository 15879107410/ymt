type ScopeChecklistCardProps = {
  title: string;
  items: string[];
  className?: string;
};

// 这个组件把“当前版本能做什么 / 不做什么”统一成同一种展示，方便用户快速理解边界。
export function ScopeChecklistCard({
  title,
  items,
  className,
}: ScopeChecklistCardProps) {
  return (
    <section
      className={`rounded-[1.75rem] bg-card-soft p-5 text-sm leading-7 text-muted ${className ?? ""}`}
    >
      <p className="font-heading text-xl font-extrabold text-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item}>
            {index + 1}. {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
