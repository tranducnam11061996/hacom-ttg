"use client";
import { useRef, useState, type ReactNode } from "react";
import type { catalogData } from "@/data";
import { Sidebar } from "./Sidebar";
import { Pagination } from "@/components/ui/Pagination";
import { useDemo } from "@/components/ui/Demo";
type SidebarData = Pick<
  typeof catalogData,
  "title" | "categoryLinks" | "filterGroups"
>;
export function CatalogResults({
  children,
  totalProducts,
  totalPages,
  sortOptions,
  sidebar,
}: {
  children: ReactNode;
  totalProducts: number;
  totalPages: number;
  sortOptions: string[];
  sidebar: SidebarData;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterButton = useRef<HTMLButtonElement>(null);
  const notify = useDemo();
  function close() {
    setFilterOpen(false);
    filterButton.current?.focus({ preventScroll: true });
  }
  return (
    <>
      <div className="listing-main">
        <Sidebar data={sidebar} open={filterOpen} onClose={close} />
        <section
          className="listing-products"
          aria-labelledby="listing-products-title"
        >
          <h2 id="listing-products-title" className="sr-only">
            Danh sách sản phẩm
          </h2>
          <div className="listing-toolbar">
            <p>
              Tìm thấy <span>{totalProducts}</span> sản phẩm
            </p>
            <button
              ref={filterButton}
              className="listing-filter-open"
              type="button"
              data-filter-open=""
              aria-controls="listing-sidebar"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen(true)}
            >
              Lọc sản phẩm
            </button>
            <select
              data-sort-demo=""
              aria-label="Sắp xếp sản phẩm"
              onChange={notify}
            >
              {sortOptions.map((name, i) => (
                <option key={i} value={i}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="listing-grid">{children}</div>
          <Pagination totalPages={totalPages} />
        </section>
      </div>
      <div
        className="listing-filter-overlay"
        data-filter-close=""
        hidden={!filterOpen}
        onClick={close}
      />
    </>
  );
}
