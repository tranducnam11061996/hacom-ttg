"use client";
import Link from "next/link";
import { routes } from "@/lib/routes";

import { memo, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { DemoButton, DemoForm, useDemo } from "@/components/ui/Demo";
import { Dialog } from "@/components/ui/Dialog";
import { Pagination } from "@/components/ui/Pagination";
import { formatMoney } from "@/lib/format";
import type { PickerGroup, PickerProduct } from "./types";

const ProductRow = memo(function ProductRow({ item }: { item: PickerProduct }) {
  return (
    <article className="bp-picker-item" data-picker-product={item.id}>
      <Link prefetch={false} href={routes.product} className="bp-picker-image">
        <AssetImage image={item.image} alt={item.name} />
      </Link>
      <div className="bp-picker-text">
        <Link prefetch={false} href={routes.product} className="bp-picker-name">
          {item.name}
        </Link>
        {item.info.map((info, i) => (
          <p className="bp-picker-info" key={i}>
            {info.label}{" "}
            <b
              className={
                info.label.includes("Kho")
                  ? info.value === "Còn hàng"
                    ? "bp-stock"
                    : "bp-empty"
                  : undefined
              }
            >
              {info.value}
            </b>
          </p>
        ))}
        <p className="bp-picker-price">
          {item.priceLabel ?? `${formatMoney(item.price)} VNĐ`}
        </p>
      </div>
      <DemoButton className="bp-buy">
        Thêm vào cấu hình <span aria-hidden="true">›</span>
      </DemoButton>
    </article>
  );
});
const ProductList = memo(function ProductList({ products }: { products: PickerProduct[] }) {
  return <div className="bp-picker-list">{products.map((item) => <ProductRow key={item.id} item={item} />)}</div>;
});
export function Picker({
  group,
  onClose,
}: {
  group: PickerGroup;
  onClose: () => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const notify = useDemo(),
    picker = group.picker;
  return (
    <Dialog
      id="component-picker"
      className={`bp-picker${filtersOpen ? " bp-filters-open" : ""}`}
      titleId="bp-picker-title"
      onClose={onClose}
    >
      <button
        type="button"
        className="bp-close"
        data-picker-close=""
        aria-label="Đóng chọn linh kiện"
        onClick={onClose}
      >
        ×
      </button>
      <header className="bp-picker-header">
        <h2 id="bp-picker-title">Chọn linh kiện</h2>
        <DemoForm className="bp-search" autoComplete="off">
          <input
            type="search"
            aria-label="Tìm linh kiện"
            placeholder="Bạn cần tìm linh kiện gì?"
          />
          <button type="submit" aria-label="Tìm linh kiện">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="7" />
              <path d="m15 15 6 6" />
            </svg>
          </button>
        </DemoForm>
        <button
          type="button"
          className="bp-filter-toggle"
          aria-expanded={filtersOpen}
          aria-controls="bp-picker-panels"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          Bộ lọc
        </button>
      </header>
      <div id="bp-picker-panels" className="bp-picker-panels">
        <DemoForm
          className="bp-picker-body"
          data-picker-group={group.id}
          autoComplete="off"
          onChange={notify}
        >
          <aside className="bp-filters" aria-label="Bộ lọc linh kiện">
            <h3>Lọc sản phẩm theo</h3>
            <div className="bp-filter-scroll">
              {picker.filters.map((f, i) => (
                <section key={i}>
                  <h4>{f.title}</h4>
                  <div className="bp-filter-values">
                    {f.values.map((value, j) => (
                      <label key={j}>
                        <input type="checkbox" /> <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </aside>
          <div className="bp-picker-content">
            <div className="bp-toolbar">
              <div className="bp-sort">
                <label>
                  Sắp xếp:{" "}
                  <select aria-label="Sắp xếp linh kiện">
                    {picker.sort.map((value, i) => (
                      <option key={i}>{value}</option>
                    ))}
                  </select>
                </label>
                <DemoButton>Còn hàng</DemoButton>
                <DemoButton className="bp-clear">Xóa bộ lọc</DemoButton>
              </div>
              <div className="bp-pagination">
                <Pagination
                  totalPages={
                    picker.pages.filter((p) => /^\d+$/.test(p.label)).length
                  }
                />
                {picker.pages.some((p) => !/^\d+$/.test(p.label)) && (
                  <DemoButton
                    className="bp-next"
                    aria-label="Trang tiếp theo"
                  >
                    ›
                  </DemoButton>
                )}
              </div>
            </div>
            <ProductList products={picker.products} />
          </div>
        </DemoForm>
      </div>
      <p
        className="bp-picker-status"
        role="status"
        data-demo-status=""
        hidden
      />
    </Dialog>
  );
}
