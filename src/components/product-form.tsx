type ProductFormProps = {
  action: string;
  submitLabel: string;
  initialValues?: {
    name?: string;
    imageUrl?: string;
    description?: string;
    price?: number;
    stock?: number;
    status?: "ACTIVE" | "INACTIVE";
  };
};

// 商品表单在新增和编辑页复用，并按 stitch/_7 的左右分栏结构统一布局。
export function ProductForm({
  action,
  submitLabel,
  initialValues,
}: ProductFormProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <form
        action={action}
        method="post"
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
      >
        <section className="flex flex-col gap-6 lg:col-span-8">
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8">
            <h3 className="mb-4 font-heading text-xl font-bold text-foreground">
              商品图片
            </h3>
            <div className="rounded-[1.5rem] border-2 border-dashed border-border-soft/50 bg-card-soft/60 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card-strong text-3xl text-primary">
                🖼️
              </div>
              <p className="font-heading font-semibold text-foreground">点击上传</p>
              <p className="mt-1 text-xs text-muted">支持 PNG、JPG，最大 10MB</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8">
            <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
              基本信息
            </h3>
            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-muted">
                  商品名称
                </label>
                <input
                  name="name"
                  className="field-input"
                  defaultValue={initialValues?.name ?? ""}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-muted">
                  商品图片 URL（可留空）
                </label>
                <input
                  name="imageUrl"
                  className="field-input"
                  defaultValue={initialValues?.imageUrl ?? ""}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-muted">
                    商品价格
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    className="field-input"
                    defaultValue={initialValues?.price ?? 0}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-muted">
                    商品库存
                  </label>
                  <input
                    name="stock"
                    type="number"
                    className="field-input"
                    defaultValue={initialValues?.stock ?? 0}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-muted">
                  商品描述
                </label>
                <textarea
                  name="description"
                  rows={5}
                  className="field-input"
                  defaultValue={initialValues?.description ?? ""}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-muted">
                  商品状态
                </label>
                <select
                  name="status"
                  className="field-input"
                  defaultValue={initialValues?.status ?? "ACTIVE"}
                >
                  <option value="ACTIVE">上架</option>
                  <option value="INACTIVE">下架</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:col-span-4">
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8">
            <p className="text-sm leading-7 text-muted">
              当前商品模型只保留 MVP 必需字段。图片先支持 URL 或占位，后续如果要接真实上传，再在这个基础上扩展。
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:mt-auto">
            <button
              type="button"
              className="w-full rounded-full bg-card-strong px-8 py-4 font-heading font-bold text-primary"
            >
              保存草稿
            </button>
            <button className="w-full rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] px-6 py-4 font-heading font-bold text-white shadow-[0_12px_28px_rgba(176,38,4,0.25)]">
              {submitLabel}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
