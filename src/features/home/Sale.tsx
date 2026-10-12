"use client";

import { useRef, useState } from "react";
import type { SaleCollection } from "./types";
import type { ImageAsset } from "@/components/ui/AssetImage";
import { AssetImage } from "@/components/ui/AssetImage";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { ProductCard } from "@/components/product/ProductCard";
import { Carousel } from "@/components/product/Carousel";

const labels = [
  "Hot sale",
  "PC doanh nghiệp kèm màn",
  "PC doanh nghiệp",
  "PC Intel Gaming",
  "PC AMD Gaming",
  "PC đồ họa — làm việc",
];
export function Sale({ collections, saleTitle, overlays }: { collections: SaleCollection[]; saleTitle: ImageAsset; overlays: Record<string, ImageAsset> }) {
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState(0),
    [open, setOpen] = useState(false);
  const tabs = useRef<HTMLDivElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  function select(index: number, focus = false) {
    if (index === selected) return;
    const current = collections[selected];
    const track = document.getElementById(`sale-track-${current.id}`);
    const step = (track?.firstElementChild?.getBoundingClientRect().width ?? 0) + 10;
    const position = Math.round((track?.scrollLeft ?? 0) / step);
    setPositions((previous) => ({ ...previous, [current.id]: position }));
    setSelected(index);
    if (focus)
      tabs.current
        ?.querySelectorAll<HTMLButtonElement>("button")
        [index]?.focus();
  }
  return (
    <section
      data-sale=""
      className="sale-section"
      aria-labelledby="sale-title"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault();
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <h2 id="sale-title">
        <span className="sr-only">Deal HOT mỗi ngày - Khuyến mãi liền tay</span>
        <AssetImage image={saleTitle} className="sale-title" />
      </h2>
      <div
        ref={tabs}
        id="sale-groups"
        role="tablist"
        aria-label="Nhóm khuyến mãi"
        className="sale-groups"
        hidden={!open}
      >
        {collections.map((c, i) => (
          <button
            key={c.id}
            id={`tab-${c.id}`}
            type="button"
            role="tab"
            aria-controls={`collection-${c.id}`}
            aria-selected={i === selected}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              let next = i;
              if (["ArrowRight", "ArrowDown"].includes(e.key))
                next = (i + 1) % labels.length;
              else if (["ArrowLeft", "ArrowUp"].includes(e.key))
                next = (i + labels.length - 1) % labels.length;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = labels.length - 1;
              else return;
              e.preventDefault();
              select(next, true);
            }}
          >
            {labels[i]}
          </button>
        ))}
      </div>
      {[collections[selected]].map((c) => (
        <div
          key={c.id}
          id={`collection-${c.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${c.id}`}
        >
          <Carousel
            initialIndex={positions[c.id] ?? 0}
            key={c.id}
            id={`sale-track-${c.id}`}
            label={labels[selected]}
            sale
          >
            {c.products.map((p, j) => (
              <ProductCard key={j} product={p} overlays={overlays} />
            ))}
          </Carousel>
        </div>
      ))}
      <div className="sale-footer">
        <Link prefetch={false} href={routes.catalog} className="sale-all">
          Xem tất cả{" "}
          <svg
            viewBox="0 -960 960 960"
            width="16"
            height="16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z" />
          </svg>
        </Link>
        <button
          ref={toggle}
          type="button"
          data-sale-toggle=""
          aria-controls="sale-groups"
          aria-expanded={open}
          aria-label={`Chọn nhóm: ${labels[selected]}`}
          className="sale-toggle"
          onClick={() => setOpen(!open)}
        >
          Chọn nhóm
        </button>
      </div>
    </section>
  );
}
