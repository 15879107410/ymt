import Link from "next/link";
import { UserRole } from "@/generated/prisma/enums";
import { FlashBanner } from "@/components/flash-banner";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

type AuthPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const authHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCOV4TeEf9DvVvhB3i4AD0JgVoJ257gIzU8hf4ixQvIT1aCxQ_iuLcB-ayweAF_iTAHtuASeOXkZGy9WfUZEUEiPAjXfZOl6QE_VyQTYzy-1m6-hFs090kgsHwJ4TPrdkwEkQYJvJVrVLzT8vZGrOcjuK140NqCbCbwWIb1N9HyZT4DeL5w1BVVd9M-tDaLlwyY_lCXvMd4Zf9v6lhdS0nSunWajlLqjj8ojwAsj_7fgET5vXp_pxB_wzmib2-wt3soGsDaoYhhEIY";
const wechatLogo =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-bhGbEY7m_KtdpT7tfHVlUCyLs7BaZmcdMz4pwfcZVRXE_HGri-lrCzH5HX5fBWvNTU1kNkV-dbS9UskwbMNOPszjgxAqooJ6k0y-4iQR-2JUTe3ipwJmoYhLfvg6lxx9NsztLiDWH7a8-OPazDVqFrblP_n8M1JGpkymZ0oBTHbJoyf_zNGiVIe4QrKC2v4Vpt3Rc0uyTxqf0mz30QXLi2N-h_QRzCqezbN8C-lQBuB_01mUf5SKeHzEA8xQQlpRQPmXisrV4bo";

// 登录页：只保留登录表单，注册入口通过底部链接跳转到注册页。
export default async function AuthPage({ searchParams }: AuthPageProps) {
  const user = await getSessionUser();
  const { status } = await searchParams;

  if (user?.role === UserRole.MERCHANT) {
    redirect("/merchant");
  }

  if (user?.role === UserRole.CONSUMER) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 antialiased">
      <div className="relative grid min-h-[600px] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2rem] bg-card-soft shadow-[0_40px_80px_-20px_rgba(78,33,35,0.08)] md:grid-cols-2">
        <Link
          href="/"
          className="absolute left-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-card text-lg font-bold text-primary shadow-[0_8px_20px_rgba(78,33,35,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
          aria-label="返回首页"
        >
          ←
        </Link>

        <section className="relative hidden overflow-hidden rounded-l-[2rem] bg-card-strong p-12 text-white md:flex md:flex-col md:justify-end">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply"
            style={{ backgroundImage: `url(${authHeroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <div className="relative z-10">
            <h1 className="font-heading -ml-1 text-5xl font-extrabold tracking-tight">
              Lumière
              <br />
              Local
            </h1>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-white/90">
              体验城市精选生活。连接本地高品质商家与追求品味的您。
            </p>
          </div>
        </section>

        <section className="relative flex flex-col justify-center p-8 md:p-16">
          <div className="mb-12 text-center md:hidden">
            <h1 className="font-heading text-4xl font-extrabold tracking-[-0.04em] text-primary">
              Lumière
            </h1>
            <p className="mt-2 text-sm text-muted">精选本地生活</p>
          </div>

          <div className="mx-auto w-full max-w-sm space-y-10">
            {status === "invalid" && (
              <FlashBanner
                tone="error"
                title="登录失败"
                description="用户名或密码不正确，请检查后重新输入。"
              />
            )}

            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                欢迎回来
              </h2>
              <p className="text-base text-muted">请登录您的账号以继续</p>
            </div>

            <form action="/api/auth/login" method="post" className="space-y-5">
              <input
                name="username"
                className="field-input"
                placeholder="用户名"
                required
              />
              <input
                name="password"
                type="password"
                className="field-input"
                placeholder="密码"
                required
              />
              <button className="flex w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#b02604,#ff7859)] px-6 py-4 font-heading text-lg font-bold text-white shadow-[0_8px_20px_-6px_rgba(176,38,4,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                使用账号登录
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-soft/30" />
              <span className="mx-4 shrink-0 text-sm text-muted">其他登录方式</span>
              <div className="flex-grow border-t border-border-soft/30" />
            </div>

            <button className="flex w-full items-center justify-center rounded-full bg-card px-6 py-4 font-heading text-base font-bold text-foreground transition-colors duration-300 hover:bg-card-strong">
              <span
                aria-label="WeChat"
                className="mr-3 h-5 w-5 bg-contain bg-center bg-no-repeat opacity-80"
                style={{ backgroundImage: `url(${wechatLogo})` }}
              />
              微信快捷登录
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <span>还没有账号？</span>
              <Link
                href="/auth/register"
                className="font-bold text-primary transition-colors hover:text-primary-soft"
              >
                立即注册
              </Link>
            </div>

            <p className="text-center text-xs text-muted">
              登录即表示您同意我们的
              <span className="text-primary"> 服务条款 </span>
              和
              <span className="text-primary">隐私政策</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
