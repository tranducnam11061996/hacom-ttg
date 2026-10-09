import Link from "next/link";
import { productData } from "@/data";
import { DemoButton } from "@/components/ui/Demo";
import { routes } from "@/lib/routes";
import { ProductCard } from "./ProductCard";
export function SimilarProducts() {
  return (
    <section className="pd-similar" aria-labelledby="pd-similar-title">
      <div className="pd-section-heading">
        <h2 id="pd-similar-title">SẢN PHẨM TƯƠNG TỰ</h2>
        <Link prefetch={false} href={routes.catalog}>
          Xem tất cả{" "}
          <svg aria-hidden="true" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z" />
          </svg>
        </Link>
      </div>
      <div className="pd-similar-slider">
        <div className="pd-similar-track">
          {productData.similarProducts.map((p, i) => (
            <ProductCard key={i} product={p} overlays={productData.overlays} />
          ))}
        </div>
        <DemoButton
          className="pd-arrow pd-prev"
          aria-label="Sản phẩm tương tự trước"
        >
          ‹
        </DemoButton>
        <DemoButton
          className="pd-arrow pd-next"
          aria-label="Sản phẩm tương tự tiếp theo"
        >
          ›
        </DemoButton>
      </div>
    </section>
  );
}
