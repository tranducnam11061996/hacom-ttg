import Link from "next/link";
import { productData as data } from "@/data";
import { Content } from "@/components/ui/Content";
import { DemoButton } from "@/components/ui/Demo";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { Support } from "@/components/support/Support";
import { FloatingContact } from "@/components/support/FloatingContact";
import { routes } from "@/lib/routes";
import { Gallery } from "./Gallery";
import { Combo } from "./Combo";
import { Summary } from "./Summary";
export function ProductDetail() {
  return (
    <main id="main" className="product-detail-screen">
      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Đường dẫn">
          <Link prefetch={false} href={routes.home}>
            Trang chủ
          </Link>
          <span aria-hidden="true">&gt;</span>
          <Link prefetch={false} href={routes.catalog}>
            PC GAMING
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>{data.title}</span>
        </nav>
        <div className="pd-top">
          <Gallery />
          <Summary />
          <Combo />
        </div>
        <div className="pd-information">
          {(
            [
              { kind: "description", title: "MÔ TẢ SẢN PHẨM" },
              { kind: "specification", title: "THÔNG SỐ KỸ THUẬT" },
            ] as const
          ).map((p) => (
            <section
              className={`pd-information-panel pd-${p.kind}`}
              key={p.kind}
            >
              <h2>{p.title}</h2>
              <Content className="pd-content" html={data.fragments[p.kind]} />
              <div className="pd-more">
                <DemoButton>
                  Xem thêm <span aria-hidden="true">⌄</span>
                </DemoButton>
              </div>
            </section>
          ))}
        </div>
        <SimilarProducts />
        <Support className="pd-support support-block" />
      </div>
      <FloatingContact />
    </main>
  );
}
