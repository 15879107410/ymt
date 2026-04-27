import type { Metadata } from "next";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "YMT 本地生活 MVP",
  description: "一个聚焦商家入驻、商品发布、消费者下单的本地生活 MVP。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 在根布局读取当前登录用户，方便整站统一渲染顶部导航和入口状态。
  const user = await getSessionUser();

  return (
    // 这里改用本地字体栈，避免构建时因为外网字体请求失败而阻塞打包。
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
