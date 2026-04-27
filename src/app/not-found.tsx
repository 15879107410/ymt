import Link from "next/link";

// 自定义 404 页面，避免用户进入不存在的商品或路由时看到默认空白提示。
export default function NotFoundPage() {
  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-3xl surface-card rounded-[2.5rem] p-10 text-center md:p-14">
        <span className="pill">404</span>
        <h1 className="section-title mt-6 text-5xl leading-[0.98]">
          这个页面
          <br />
          暂时没有找到。
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          可能是你访问了不存在的商品、已经失效的地址，或者这个页面还没进入当前 MVP 范围。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full px-6 py-4 text-sm font-bold text-white gradient-brand"
          >
            返回首页
          </Link>
          <Link
            href="/merchant"
            className="rounded-full bg-card-soft px-6 py-4 text-sm font-bold text-primary"
          >
            前往商家后台
          </Link>
        </div>
      </div>
    </div>
  );
}
