import { requireMerchant } from "@/lib/auth";
import { FlashBanner } from "@/components/flash-banner";
import { MerchantWorkspaceShell } from "@/components/merchant-workspace-shell";
import { prisma } from "@/lib/prisma";

type MerchantProfilePageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

// 商家入驻页按 stitch/_9 的左右分栏表单结构重做，业务字段仍然对应当前 MVP 数据表。
export default async function MerchantProfilePage({
  searchParams,
}: MerchantProfilePageProps) {
  const user = await requireMerchant();
  const { status } = await searchParams;

  const merchant = await prisma.merchantProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  return (
    <MerchantWorkspaceShell
      title="商家入驻"
      description="欢迎来到 Lumière。请在下方提供您的业务信息，以建立您的高级店面。我们只精选最优质的商家。"
      activePath="profile"
    >
      <div className="space-y-6">
        {status === "saved" && (
          <FlashBanner
            tone="success"
            title="店铺资料已保存"
            description="当前版本不会走人工审核，资料保存后就会直接在商家后台生效。"
          />
        )}
        {status === "validation" && (
          <FlashBanner
            tone="error"
            title="资料未保存成功"
            description="请把店铺名称、联系人、电话、地址和简介补完整后再提交。"
          />
        )}

        <form
          action="/api/merchant/profile"
          method="post"
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
        >
          <section className="flex flex-col gap-6 lg:col-span-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-bl-full bg-primary/10 blur-2xl" />
              <h2 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
                <span className="text-primary">🏪</span>
                店铺基本信息
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 ml-1 block text-sm font-semibold text-muted">
                    店铺名称
                  </label>
                  <input
                    name="shopName"
                    className="field-input"
                    defaultValue={merchant?.shopName ?? ""}
                    placeholder="例如：Lumière 咖啡馆"
                  />
                </div>
                <div>
                  <label className="mb-2 ml-1 block text-sm font-semibold text-muted">
                    店铺简介
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    className="field-input"
                    defaultValue={merchant?.description ?? ""}
                    placeholder="描述您的氛围、特色以及使您的场地与众不同的地方..."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8">
              <h2 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
                <span className="text-primary">📇</span>
                联系方式与地址
              </h2>
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 ml-1 block text-sm font-semibold text-muted">
                    联系人姓名
                  </label>
                  <input
                    name="contactName"
                    className="field-input"
                    defaultValue={merchant?.contactName ?? ""}
                    placeholder="全名"
                  />
                </div>
                <div>
                  <label className="mb-2 ml-1 block text-sm font-semibold text-muted">
                    联系电话
                  </label>
                  <input
                    name="contactPhone"
                    className="field-input"
                    defaultValue={merchant?.contactPhone ?? ""}
                    placeholder="+86 138 0000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 ml-1 block text-sm font-semibold text-muted">
                  店铺地址
                </label>
                <input
                  name="address"
                  className="field-input"
                  defaultValue={merchant?.address ?? ""}
                  placeholder="详细街道地址，城市，省份，邮编"
                />
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex h-full min-h-[300px] flex-col rounded-[2rem] bg-card p-6 shadow-[0_8px_30px_rgba(78,33,35,0.04)] md:p-8">
              <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
                封面图片
              </h2>
              <p className="mb-6 text-sm text-muted">
                上传店铺封面。需要高分辨率图片。
              </p>
              <div className="flex min-h-[300px] flex-1 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-border-soft/50 bg-card-soft/50 p-6 text-center transition-colors hover:bg-card-soft">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card-strong text-3xl text-primary">
                  🖼️
                </div>
                <span className="mb-1 font-heading font-semibold text-foreground">
                  点击上传
                </span>
                <span className="text-xs text-muted">支持 PNG、JPG，最大 10MB</span>
                <input
                  name="coverImageUrl"
                  className="mt-6 field-input"
                  defaultValue={merchant?.coverImageUrl ?? ""}
                  placeholder="也可直接填写图片 URL"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="w-full rounded-full bg-card-strong px-8 py-4 font-heading font-bold text-primary"
              >
                保存草稿
              </button>
              <button className="w-full rounded-full bg-[linear-gradient(135deg,#b02604,#ff7859)] px-10 py-4 font-heading font-bold text-white shadow-[0_8px_20px_rgba(176,38,4,0.2)]">
                提交入驻
              </button>
            </div>
          </aside>
        </form>
      </div>
    </MerchantWorkspaceShell>
  );
}
