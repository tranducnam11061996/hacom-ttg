import "@/features/product-detail/product-detail.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PC TTG Core Ultra 7 270K Plus – RTX 5070 12GB OC",
  description:
    "Chi tiết PC TTG Gaming Core Ultra 7 270K Plus – RTX 5070 12GB OC: hình ảnh, cấu hình, mô tả và thông số trong bản demo TTG SHOP.",
};
import { ProductDetail } from "@/features/product-detail/ProductDetail";
export default function Page() {
  return <ProductDetail />;
}
