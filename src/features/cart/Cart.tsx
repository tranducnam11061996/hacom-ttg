import Link from "next/link";
import { cartData } from "@/data";
import { DemoButton, DemoForm } from "@/components/ui/Demo";
import { Support } from "@/components/support/Support";
import { FloatingContact } from "@/components/support/FloatingContact";
import { routes } from "@/lib/routes";
import { CartItems } from "./CartItems";
import { BuyerInformation } from "./BuyerInformation";
import { CartSummary } from "./CartSummary";
export function Cart() {
  const total = cartData.items.reduce((n, p) => n + p.price * p.quantity, 0);
  return (
    <main id="main" className="cart-screen">
      <div className="cart-container">
        <nav className="cart-breadcrumb" aria-label="Đường dẫn">
          <Link prefetch={false} href={routes.home}>
            Trang chủ
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>{cartData.labels.breadcrumb}</span>
        </nav>
        <div className="cart-heading">
          <h1>{cartData.labels.title}</h1>
          <DemoButton>{cartData.labels.clear}</DemoButton>
        </div>
        <DemoForm noValidate autoComplete="off">
          <CartItems total={total} />
          <div className="cart-customer">
            <BuyerInformation />
            <CartSummary total={total} />
          </div>
        </DemoForm>
        <Support className="cart-support support-block" />
      </div>
      <FloatingContact />
    </main>
  );
}
