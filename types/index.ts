import type { Product, Variant, Category, Coupon } from "@prisma/client";

export type ProductStatus = "ACTIVE" | "SOLD_OUT" | "PRE_ORDER" | "DRAFT";

export type ProductWithRelations = Product & {
  category: Category;
  variants: Variant[];
  coupons: Array<{ coupon: Coupon }>;
};

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
}

export interface FilterState {
  category: string;
  status: string;
  sort: string;
  search: string;
}
