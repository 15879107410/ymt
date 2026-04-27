import { notFound } from "next/navigation";
import { FlashBanner } from "@/components/flash-banner";
import { MerchantWorkspaceShell } from "@/components/merchant-workspace-shell";
import { ProductForm } from "@/components/product-form";
import { requireMerchant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type MerchantProductEditPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    status?: string;
  }>;
};

// 编辑商品页和新增页共享表单，只是把已有数据预填回来。
export default async function MerchantProductEditPage({
  params,
  searchParams,
}: MerchantProductEditPageProps) {
  const user = await requireMerchant();
  const { id } = await params;
  const { status } = await searchParams;

  const merchant = await prisma.merchantProfile.findUnique({
    where: { userId: user.id },
  });

  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
      merchantId: merchant?.id ?? -1,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <MerchantWorkspaceShell
      title="编辑商品"
      description="在不改变核心模型的前提下，允许你继续更新价格、库存和描述。"
      activePath="products"
    >
      {status === "validation" && (
        <div className="mb-6">
          <FlashBanner
            tone="error"
            title="修改未保存"
            description="请检查商品名称、价格、库存和描述是否完整后再提交。"
          />
        </div>
      )}
      <ProductForm
        action={`/api/products/${product.id}`}
        submitLabel="保存修改"
        initialValues={{
          name: product.name,
          imageUrl: product.imageUrl ?? "",
          description: product.description,
          price: product.price,
          stock: product.stock,
          status: product.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
        }}
      />
    </MerchantWorkspaceShell>
  );
}
