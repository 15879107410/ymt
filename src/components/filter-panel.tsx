"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Utensils,
  Coffee,
  ShoppingBasket,
  Leaf,
} from "lucide-react";

type FilterPanelProps = {
  currentSort?: string;
};

// 首页筛选面板：点击搜索框右侧的筛选按钮弹出，支持分类跳转和价格排序。
export function FilterPanel({ currentSort }: FilterPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // 分类快捷入口配置。
  const categories = [
    { label: "美食", icon: Utensils, href: "/category/美食" },
    { label: "咖啡", icon: Coffee, href: "/category/咖啡" },
    { label: "超市", icon: ShoppingBasket, href: "/category/超市" },
    { label: "健康", icon: Leaf, href: "/category/健康" },
  ];

  // 排序选项配置。
  const sortOptions = [
    { label: "默认排序", value: "", icon: ArrowUpDown },
    { label: "价格从低到高", value: "price_asc", icon: ArrowUp },
    { label: "价格从高到低", value: "price_desc", icon: ArrowDown },
  ];

  // 点击排序选项后直接刷新当前页并带上 sort 参数。
  const handleSort = (value: string) => {
    if (value === "") {
      router.push("/");
    } else {
      router.push(`/?sort=${value}`);
    }
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-card text-primary shadow-[0_4px_15px_rgba(78,33,35,0.05)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(78,33,35,0.1)] active:scale-95"
        aria-label="筛选排序"
      >
        <SlidersHorizontal size={18} />
      </button>

      {/* 遮罩层 */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 底部筛选面板 */}
      <div
        className={`fixed left-1/2 z-[100] w-full max-w-[390px] -translate-x-1/2 rounded-t-[2rem] bg-card shadow-[0_-8px_32px_rgba(78,33,35,0.12)] transition-transform duration-300 ease-out ${
          open ? "bottom-0 translate-y-0" : "bottom-0 translate-y-full"
        }`}
      >
        {/* 面板头部 */}
        <div className="flex items-center justify-between border-b border-card-soft px-6 py-4">
          <h3 className="font-heading text-lg font-bold text-foreground">
            筛选排序
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-card-soft text-muted"
            aria-label="关闭筛选"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {/* 分类快捷入口 */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-bold text-muted">分类浏览</h4>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-2 rounded-[1rem] bg-card-soft p-3 transition-all duration-200 hover:bg-card hover:shadow-sm"
                  >
                    <Icon size={22} className="text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {cat.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 价格排序 */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-muted">价格排序</h4>
            <div className="space-y-2">
              {sortOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive =
                  (currentSort === undefined && opt.value === "") ||
                  currentSort === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSort(opt.value)}
                    className={`flex w-full items-center gap-3 rounded-[1rem] px-4 py-3.5 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                        : "bg-card-soft text-foreground hover:bg-card"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-bold">{opt.label}</span>
                    {isActive && (
                      <span className="ml-auto text-xs font-bold text-primary">
                        已选
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
