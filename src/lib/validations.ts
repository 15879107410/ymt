import { z } from "zod";

// 注册和登录先统一用户名密码长度规则，避免表单和接口口径不一致。
export const authSchema = z.object({
  username: z.string().trim().min(3, "用户名至少 3 个字符"),
  password: z.string().trim().min(6, "密码至少 6 个字符"),
  role: z.enum(["MERCHANT", "CONSUMER"]),
});

// 商家入驻资料是 MVP 的核心数据，所以这里单独定义校验。
export const merchantProfileSchema = z.object({
  shopName: z.string().trim().min(2, "店铺名称至少 2 个字符"),
  contactName: z.string().trim().min(2, "联系人至少 2 个字符"),
  contactPhone: z.string().trim().min(6, "联系电话不能为空"),
  address: z.string().trim().min(4, "店铺地址不能为空"),
  description: z.string().trim().min(6, "店铺简介至少 6 个字符"),
  coverImageUrl: z.string().trim().optional(),
});

// 商品表单和数据库字段保持一致，方便后续维护。
export const productSchema = z.object({
  name: z.string().trim().min(2, "商品名称至少 2 个字符"),
  description: z.string().trim().min(6, "商品描述至少 6 个字符"),
  imageUrl: z.string().trim().optional(),
  price: z.coerce.number().positive("价格必须大于 0"),
  stock: z.coerce.number().int().min(0, "库存不能小于 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

// 下单表单只保留当前 MVP 需要的收货信息和数量。
export const orderSchema = z.object({
  productId: z.coerce.number().int(),
  quantity: z.coerce.number().int().min(1, "购买数量至少为 1"),
  consigneeName: z.string().trim().min(2, "收货人不能为空"),
  consigneePhone: z.string().trim().min(6, "联系电话不能为空"),
  consigneeAddress: z.string().trim().min(4, "收货地址不能为空"),
});
