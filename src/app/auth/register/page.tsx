"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FlashBanner } from "@/components/flash-banner";

const authHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCOV4TeEf9DvVvhB3i4AD0JgVoJ257gIzU8hf4ixQvIT1aCxQ_iuLcB-ayweAF_iTAHtuASeOXkZGy9WfUZEUEiPAjXfZOl6QE_VyQTYzy-1m6-hFs090kgsHwJ4TPrdkwEkQYJvJVrVLzT8vZGrOcjuK140NqCbCbwWIb1N9HyZT4DeL5w1BVVd9M-tDaLlwyY_lCXvMd4Zf9v6lhdS0nSunWajlLqjj8ojwAsj_7fgET5vXp_pxB_wzmib2-wt3soGsDaoYhhEIY";

// 注册页：独立的注册表单，角色选择做成可交互卡片。
export default function RegisterPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? undefined;

  // 默认选中消费者角色。
  const [role, setRole] = useState<"CONSUMER" | "MERCHANT">("CONSUMER");

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

          <div className="mx-auto w-full max-w-sm space-y-8">
            {(status === "exists" || status === "validation") && (
              <div className="space-y-3">
                {status === "exists" && (
                  <FlashBanner
                    tone="error"
                    title="注册失败"
                    description="这个用户名已经被占用了，请换一个新的用户名。"
                  />
                )}
                {status === "validation" && (
                  <FlashBanner
                    tone="info"
                    title="请补全信息"
                    description="当前表单信息不完整，至少需要填写符合要求的用户名和密码。"
                  />
                )}
              </div>
            )}

            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                创建账号
              </h2>
              <p className="text-base text-muted">选择您的身份，开始体验</p>
            </div>

            {/* 角色选择卡片 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("CONSUMER")}
                className={`group flex flex-col items-center justify-center rounded-[1rem] p-5 transition-all duration-300 hover:-translate-y-1 ${
                  role === "CONSUMER"
                    ? "bg-card shadow-[0_4px_16px_rgba(176,38,4,0.12)] ring-2 ring-primary"
                    : "bg-card hover:bg-background"
                }`}
              >
                <div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                    role === "CONSUMER"
                      ? "bg-[linear-gradient(135deg,#b02604,#ff7859)] text-white"
                      : "bg-card-soft text-primary group-hover:bg-[linear-gradient(135deg,#b02604,#ff7859)] group-hover:text-white"
                  }`}
                >
                  <span className="text-2xl">👤</span>
                </div>
                <span className="font-heading text-base font-bold text-foreground">
                  消费者
                </span>
                <span className="mt-1 text-center text-xs text-muted">
                  探索精选服务
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("MERCHANT")}
                className={`group flex flex-col items-center justify-center rounded-[1rem] p-5 transition-all duration-300 hover:-translate-y-1 ${
                  role === "MERCHANT"
                    ? "bg-card shadow-[0_4px_16px_rgba(128,63,158,0.12)] ring-2 ring-[#803f9e]"
                    : "bg-card hover:bg-background"
                }`}
              >
                <div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                    role === "MERCHANT"
                      ? "bg-[linear-gradient(135deg,#803f9e,#dc95fb)] text-white"
                      : "bg-card-soft text-tertiary group-hover:bg-[linear-gradient(135deg,#803f9e,#dc95fb)] group-hover:text-white"
                  }`}
                >
                  <span className="text-2xl">🏪</span>
                </div>
                <span className="font-heading text-base font-bold text-foreground">
                  商家
                </span>
                <span className="mt-1 text-center text-xs text-muted">
                  管理您的店铺
                </span>
              </button>
            </div>

            <form action="/api/auth/register" method="post" className="space-y-5">
              <input type="hidden" name="role" value={role} />

              <input
                name="username"
                className="field-input"
                placeholder="用户名（至少 3 个字符）"
                required
                minLength={3}
              />
              <input
                name="password"
                type="password"
                className="field-input"
                placeholder="密码（至少 6 位）"
                required
                minLength={6}
              />
              <button className="w-full rounded-full bg-foreground px-6 py-4 font-heading text-lg font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                注册并开始体验
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <span>已有账号？</span>
              <Link
                href="/auth"
                className="font-bold text-primary transition-colors hover:text-primary-soft"
              >
                立即登录
              </Link>
            </div>

            <p className="text-center text-xs text-muted">
              注册即表示您同意我们的
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
