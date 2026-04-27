import clsx from "clsx";

type InfoPanelProps = {
  title?: string;
  children: React.ReactNode;
  tone?: "soft" | "default";
  className?: string;
};

// 说明卡片统一处理页面里的“当前版本说明”“字段说明”“后续扩展说明”等文字块。
export function InfoPanel({
  title,
  children,
  tone = "soft",
  className,
}: InfoPanelProps) {
  return (
    <div
      className={clsx(
        "rounded-[1.75rem] p-5 text-sm leading-7 text-muted",
        tone === "soft" ? "bg-card-soft" : "surface-card",
        className,
      )}
    >
      {title && (
        <p className="font-heading text-xl font-extrabold text-foreground">
          {title}
        </p>
      )}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}
