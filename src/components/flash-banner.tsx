import clsx from "clsx";

type FlashBannerProps = {
  tone: "success" | "error" | "info";
  title: string;
  description: string;
};

// 顶部反馈条用来承接表单提交后的结果提示，避免用户提交后没有反馈。
export function FlashBanner({ tone, title, description }: FlashBannerProps) {
  const toneClassMap = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    error: "bg-rose-50 text-rose-700 ring-rose-200",
    info: "bg-amber-50 text-amber-700 ring-amber-200",
  } as const;

  return (
    <div
      className={clsx(
        "rounded-[1.5rem] px-5 py-4 ring-1",
        toneClassMap[tone],
      )}
    >
      <p className="font-heading text-lg font-extrabold">{title}</p>
      <p className="mt-1 text-sm leading-6">{description}</p>
    </div>
  );
}
