import "@/features/cart/cart.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Giỏ hàng demo",
  description:
    "Xem giỏ hàng mẫu và nhập thử thông tin người mua trong giao diện TGB SHOP. Các thao tác mua hàng và thanh toán chỉ phục vụ demo.",
};
import { Cart } from "@/features/cart/Cart";
export default function Page() {
  return <Cart />;
}
