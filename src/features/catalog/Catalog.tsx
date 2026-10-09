import Link from "next/link";
import { catalogData as data } from "@/data";
import { ProductCard } from "@/components/product/ProductCard";
import { Support } from "@/components/support/Support";
import { FloatingContact } from "@/components/support/FloatingContact";
import { routes } from "@/lib/routes";
import { Description } from "./Description";
import { CatalogResults } from "./CatalogResults";
export function Catalog() {
  return (
    <main id="main" className="listing-screen">
      <h1 className="sr-only">{data.title}</h1>
      <div className="listing-container">
        <nav className="listing-breadcrumb" aria-label="Đường dẫn">
          <Link prefetch={false} href={routes.home}>
            Trang chủ
          </Link>
          <span aria-hidden="true">›</span>
          <span>{data.title}</span>
        </nav>
        <Description html={data.descriptionHtml} />
        <CatalogResults
          totalProducts={data.totalProducts}
          totalPages={data.totalPages}
          sortOptions={data.sortOptions}
          sidebar={{
            title: data.title,
            categoryLinks: data.categoryLinks,
            filterGroups: data.filterGroups,
          }}
        >
          {data.products.map((p, i) => (
            <ProductCard key={i} product={p} overlays={data.overlays} listing />
          ))}
        </CatalogResults>
        <Support />
      </div>
      <FloatingContact
        contacts={{ messenger: data.messenger, zalo: data.zalo }}
        listing
      />
    </main>
  );
}
