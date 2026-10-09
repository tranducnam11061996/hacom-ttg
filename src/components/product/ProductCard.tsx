import Link from "next/link";
import { AssetImage, type ImageAsset } from "@/components/ui/AssetImage";
import { DemoButton } from "@/components/ui/Demo";
import { Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/routes";
import { ProductTooltip } from "./ProductTooltip";

export interface Product {
  name: string;
  image: ImageAsset;
  price: string;
  market: string;
  discount: string;
  status: string;
  buy: string;
  overlay: string;
  href: string;
  tooltipHtml?: string;
}
export function ProductCard({
  product: p,
  overlays = {},
  listing = false,
}: {
  product: Product;
  overlays?: Record<string, ImageAsset>;
  listing?: boolean;
}) {
  const pictures = (
    <>
      <AssetImage
        image={p.image}
        alt={p.name}
        className={listing ? "listing-picture" : "size-full object-contain"}
      />
      {overlays[p.overlay] && (
        <AssetImage
          image={overlays[p.overlay]}
          className={
            listing
              ? "listing-overlay"
              : "absolute inset-x-0 bottom-0 h-2/5 w-full object-contain object-bottom"
          }
        />
      )}
    </>
  );
  return (
    <article
      data-product=""
      className={`category-card${listing ? " listing-card" : ""}`}
    >
      {listing && p.tooltipHtml ? (
        <ProductTooltip html={p.tooltipHtml} href={routes.product}>
          {pictures}
        </ProductTooltip>
      ) : (
        <Link prefetch={false} href={routes.product} className="category-image">
          {pictures}
        </Link>
      )}
      <h3 className="category-name">
        <Link prefetch={false} href={routes.product} title={p.name}>
          {p.name}
        </Link>
      </h3>
      <div className="category-prices">
        <div className="category-price-stack">
          <p className="category-price">{p.price}</p>
          {(!listing || p.market) && (
            <del className="category-market">{p.market}</del>
          )}
        </div>
        {p.discount && <span className="category-discount">{p.discount}</span>}
      </div>
      <div className="category-bottom">
        <DemoButton
          className="category-buy"
          aria-label={`${p.buy} — ${p.name}`}
        >
          <span className="category-buy-inner">
            <span className="category-cart">
              <Icon name="cart" />
            </span>
            <span>{p.buy}</span>
          </span>
        </DemoButton>
        <span
          className={`category-stock${!listing && /hết|liên hệ/i.test(p.status) ? " category-stock-empty" : ""}`}
        >
          {p.status}
        </span>
      </div>
    </article>
  );
}
