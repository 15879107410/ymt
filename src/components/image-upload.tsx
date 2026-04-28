"use client";

import { useState, useRef } from "react";

type ImageUploadProps = {
  name: string;
  defaultValue?: string;
};

// 图片上传组件：点击虚线区域选择图片，自动上传到 /api/upload，显示预览图。
export function ImageUpload({ name, defaultValue }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok) {
        setUrl(data.url);
      } else {
        alert(data.error || "上传失败");
        setPreview("");
      }
    } catch {
      alert("上传失败，请重试");
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  const hasImage = preview || url;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 上传区域 */}
      <div
        onClick={handleClick}
        className="flex min-h-[300px] flex-1 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-border-soft/50 bg-card-soft/50 p-6 text-center transition-colors hover:bg-card-soft"
      >
        {hasImage ? (
          <div className="w-full">
            <img
              src={preview || url}
              alt="封面预览"
              className="max-h-[260px] w-full rounded-xl object-cover"
            />
            <p className="mt-3 text-xs text-muted">
              {uploading ? "上传中..." : "点击重新选择"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card-strong text-3xl text-primary">
              🖼️
            </div>
            <span className="mb-1 font-heading font-semibold text-foreground">
              点击上传
            </span>
            <span className="text-xs text-muted">支持 PNG、JPG，最大 10MB</span>
          </>
        )}
      </div>

      {/* 隐藏的 URL 输入，用于表单提交 */}
      <input type="hidden" name={name} value={url} />

      {/* 图片 URL 输入 */}
      <div className="mt-4">
        <label className="mb-1 ml-1 block text-xs text-muted">图片链接</label>
        <input
          type="text"
          className="field-input"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (e.target.value) {
              setPreview(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}
