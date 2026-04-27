import clsx from "clsx";

type DashboardStatCardProps = {
  label: string;
  value: string | number;
  description: string;
  tone?: "default" | "accent";
};

// 这个卡片专门用来承载首页和后台里的关键数字，让用户一眼就能知道当前业务状态。
export function DashboardStatCard({
  label,
  value,
  description,
  tone = "default",
}: DashboardStatCardProps) {
  return (
    <article
      className={clsx(
        "rounded-[2rem] p-6",
        tone === "accent"
          ? "gradient-brand text-white shadow-[0_18px_36px_rgba(176,38,4,0.22)]"
          : "surface-soft text-foreground",
      )}
    >
      <p
        className={clsx(
          "text-sm font-bold",
          tone === "accent" ? "text-white/80" : "text-muted",
        )}
      >
        {label}
      </p>
      <p className="mt-4 font-heading text-4xl font-extrabold">{value}</p>
      <p
        className={clsx(
          "mt-3 text-sm leading-7",
          tone === "accent" ? "text-white/85" : "text-muted",
        )}
      >
        {description}
      </p>
    </article>
  );
}
