import { ProductForm } from "@/components/product-form";
import { FlashBanner } from "@/components/flash-banner";
import { MerchantWorkspaceShell } from "@/components/merchant-workspace-shell";
import { requireMerchant } from "@/lib/auth";

type MerchantProductNewPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

// 新增商品页只负责渲染表单，真正的数据提交走接口处理。
export default async function MerchantProductNewPage({
  searchParams,
}: MerchantProductNewPageProps) {
  await requireMerchant();
  const { status } = await searchParams;

  return (
    <MerchantWorkspaceShell
      title="新增商品"
      description="先把商品的最小信息补齐：名称、价格、库存、描述和上架状态。"
      activePath="products"
    >
      {status === "validation" && (
        <div className="mb-6">
          <FlashBanner
            tone="error"
            title="商品信息不完整"
            description="请至少填写商品名称、价格、库存和描述，再重新提交。"
          />
        </div>
      )}
      <ProductForm
        action="/api/products"
        submitLabel="保存并上架"
      />
    </MerchantWorkspaceShell>
  );
}
