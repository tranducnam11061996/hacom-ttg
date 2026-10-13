import "@/features/catalog/catalog.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PC Gaming",
  description:
    "Danh mục PC Gaming trong giao diện demo TGB SHOP. Xem sản phẩm mẫu, thông số, giá hiển thị và thử bộ lọc sản phẩm.",
};
import { Catalog } from "@/features/catalog/Catalog";
export default function Page() {
  return <Catalog />;
}
