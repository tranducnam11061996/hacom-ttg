"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { Fragment, useEffect, useRef } from "react";
import type { catalogData } from "@/data";
import { DemoLink, useDemo } from "@/components/ui/Demo";
import { useScrollLock } from "@/hooks/useScrollLock";

export function Sidebar({
  data,
  open,
  onClose,
}: {
  data: Pick<typeof catalogData, "title" | "categoryLinks" | "filterGroups">;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null),
    close = useRef(onClose);
  const notify = useDemo();
  useScrollLock(open);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const root = ref.current!;
    root.querySelector<HTMLButtonElement>("button")?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") close.current();
      if (e.key === "Tab") {
        const nodes = [...root.querySelectorAll<HTMLElement>("button,a,input")],
          first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    function resize() {
      if (innerWidth >= 768) close.current();
    }
    document.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  return (
    <aside
      ref={ref}
      className={`listing-sidebar${open ? " open" : ""}`}
      id="listing-sidebar"
      aria-label="Lọc sản phẩm"
    >
      <button
        className="listing-filter-close"
        type="button"
        data-filter-close=""
        aria-label="Đóng bộ lọc"
        onClick={onClose}
      >
        ×
      </button>
      <div className="listing-filter-heading">
        <h2>LỌC SẢN PHẨM</h2>
      </div>
      <p className="listing-filter-label">{data.title}</p>
      <ul className="listing-category-links">
        {data.categoryLinks.map((l, i) => (
          <li key={i}>
            <Link prefetch={false} href={routes.catalog}>
              <svg
                aria-hidden="true"
                height="16"
                width="16"
                viewBox="0 -960 960 960"
              >
                <path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z" />
              </svg>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {data.filterGroups.map((g, i) => (
        <Fragment key={i}>
          {i === 2 && <p className="listing-filter-label">LỌC SẢN PHẨM</p>}
          <section
            className={`listing-filter-group${i < 2 ? " listing-filter-primary" : ""}`}
          >
            <h3
              className={
                i < 2 ? "listing-filter-label" : "listing-filter-title"
              }
            >
              {g.title}
            </h3>
            <ul>
              {g.items.map((item, j) => (
                <li key={j}>
                  {item.checkbox ? (
                    <label>
                      <input
                        type="checkbox"
                        data-filter-demo=""
                        autoComplete="off"
                        onChange={notify}
                      />
                      {item.label}
                    </label>
                  ) : (
                    <DemoLink>{item.label}</DemoLink>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </Fragment>
      ))}
    </aside>
  );
}
