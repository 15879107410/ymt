"use client";

import { useEffect } from "react";

// 输入框点击时自动清空 placeholder，移出时恢复。解决"需要手动删除提示文字"的问题。
export function ClearPlaceholderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const el = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (el.matches(".field-input")) {
        el.dataset.ph = el.placeholder;
        el.placeholder = "";
      }
    };
    const handleBlur = (e: FocusEvent) => {
      const el = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (el.matches(".field-input") && el.dataset.ph !== undefined) {
        el.placeholder = el.dataset.ph;
        delete el.dataset.ph;
      }
    };
    document.addEventListener("focus", handleFocus, true);
    document.addEventListener("blur", handleBlur, true);
    return () => {
      document.removeEventListener("focus", handleFocus, true);
      document.removeEventListener("blur", handleBlur, true);
    };
  }, []);

  return <>{children}</>;
}
