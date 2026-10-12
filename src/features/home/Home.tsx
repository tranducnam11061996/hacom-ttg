import Link from "next/link";
import { storeData } from "@/data";
import { Carousel } from "@/components/product/Carousel";
import { ProductCard } from "@/components/product/ProductCard";
import { Support } from "@/components/support/Support";
import { categoryHref, routes } from "@/lib/routes";
import { PlaylistSection } from "@/features/videos/PlaylistCards";
import { Hero } from "./Hero";
import { Sale } from "./Sale";

function Category({
  category: c,
  index: i,
}: {
  category: (typeof storeData.categories)[number];
  index: number;
}) {
  const all = (
    <>
      Xem tất cả <span aria-hidden="true">»</span>
    </>
  );
  return (
    <section
      data-category={i}
      className="category-section"
      aria-labelledby={`category-${i}`}
    >
      <div className="category-header">
        <div className="category-heading">
          <h2 id={`category-${i}`}>{c.name}</h2>
        </div>
        {c.links.length ? (
          <div className="category-links" aria-label={`Danh mục con ${c.name}`}>
            {c.links.map((name, j) => (
              <Link prefetch={false} href={routes.catalog} key={j}>
                {name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="category-header-spacer" aria-hidden="true" />
        )}
        {categoryHref(c.name) === "#" ? (
          <Link prefetch={false} href={routes.catalog} className="category-all">
            {all}
          </Link>
        ) : (
          <Link
            prefetch={false}
            href={categoryHref(c.name)}
            className="category-all"
          >
            {all}
          </Link>
        )}
      </div>
      <div className="category-content">
        <Carousel id={`category-track-${i}`} label={c.name}>
          {c.products.map((p, j) => (
            <ProductCard key={j} product={p} overlays={storeData.overlays} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
export function Home() {
  const banners = storeData.hero.map(({ alt, image }) => ({ alt, image }));
  const collections = storeData.collections.map(({ id, products }) => ({
    id,
    products: products.map(({ name, image, price, market, discount, status, buy, overlay }) => ({
      name, image, price, market, discount, status, buy, overlay,
    })),
  }));
  return (
    <main id="main" className="site-container store-main pt-[12px]">
      <h1 className="sr-only">{storeData.title}</h1>
      <Hero banners={banners} />
      <PlaylistSection />
      <Sale collections={collections} saleTitle={storeData.saleTitle} overlays={storeData.overlays} />
      <div className="category-group">
        {storeData.categories.map((c, i) => (
          <Category key={i} category={c} index={i} />
        ))}
      </div>
      <Support />
    </main>
  );
}
