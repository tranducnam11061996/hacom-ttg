"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { headerData } from "@/data";
import { AssetImage } from "@/components/ui/AssetImage";
import { HeaderIcon, Icon } from "@/components/ui/Icon";
import { categoryHref, routes } from "@/lib/routes";

const canHover = (e: PointerEvent) =>
  ["mouse", "pen"].includes(e.pointerType) &&
  matchMedia("(any-hover:hover) and (any-pointer:fine)").matches;
function Group({
  group,
  id,
}: {
  group: (typeof headerData.categories)[number]["groups"][number];
  id: string;
}) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const media = matchMedia("(min-width:1280px)");
    const reset = () => {
      if (media.matches) setOpen(true);
    };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);
  return (
    <div className="ttg-mega-group">
      <div className="ttg-group-heading">
        <Link prefetch={false} href={routes.catalog} className="ttg-mega-title">
          {group.name}
        </Link>
        {group.children.length > 0 && (
          <button
            type="button"
            data-group-toggle=""
            aria-expanded={open}
            aria-controls={id}
            aria-label={`Thu gọn hoặc mở nhóm ${group.name}`}
            onClick={() => setOpen(!open)}
          >
            <Icon />
          </button>
        )}
      </div>
      <div id={id} data-group-children="" hidden={!open}>
        {group.children.map((name, i) => (
          <Link
            prefetch={false}
            href={routes.catalog}
            className="ttg-mega-child"
            key={i}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Menu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pointerFocus = useRef(false);
  const keyboard = useRef(false);
  const closing = useRef(false);
  function close(focus = false) {
    closing.current = true;
    setOpen(false);
    setActive(-1);
    if (focus) toggle.current?.focus();
    closing.current = false;
  }
  useEffect(() => {
    const abort = new AbortController();
    const media = matchMedia("(min-width:1280px)");
    const hover = matchMedia("(any-hover:hover) and (any-pointer:fine)");
    function reset() {
      setOpen(false);
      setActive(-1);
    }
    function size() {
      const r = root.current;
      if (!r) return;
      const top = toggle.current!.getBoundingClientRect().bottom + 12;
      if (media.matches) r.style.removeProperty("--menu-height");
      else {
        const height = `${Math.max(100, innerHeight - top - 12)}px`;
        if (r.style.getPropertyValue("--menu-height") !== height)
          r.style.setProperty("--menu-height", height);
      }
    }
    let compact = window.scrollY > 500;
    function scroll() {
      if (
        !root.current?.querySelector<HTMLElement>("[data-menu-content]")?.hidden
      )
        size();
      const next = window.scrollY > 500;
      if (next !== compact) {
        compact = next;
        reset();
      }
    }
    document.addEventListener(
      "click",
      (e) => {
        if (!root.current?.contains(e.target as Node)) reset();
      },
      { signal: abort.signal },
    );
    document.addEventListener(
      "keydown",
      (e) => {
        pointerFocus.current = false;
        if (e.key === "Escape") {
          closing.current = true;
          reset();
          if (root.current?.contains(document.activeElement))
            toggle.current?.focus();
          closing.current = false;
        }
      },
      { signal: abort.signal },
    );
    window.addEventListener(
      "resize",
      () => {
        size();
        reset();
      },
      { signal: abort.signal },
    );
    window.addEventListener("scroll", scroll, {
      passive: true,
      signal: abort.signal,
    });
    media.addEventListener("change", reset, { signal: abort.signal });
    hover.addEventListener("change", reset, { signal: abort.signal });
    size();
    return () => abort.abort();
  }, []);
  return (
    <nav className="ttg-bottom" aria-label="Danh mục cửa hàng">
      <div
        className="ttg-menu"
        data-menu-root=""
        ref={root}
        onPointerDown={() => {
          pointerFocus.current = true;
        }}
        onPointerEnter={(e) => {
          if (canHover(e)) {
            keyboard.current = false;
            setOpen(true);
          }
        }}
        onPointerLeave={(e) => {
          if (canHover(e) && !root.current?.contains(document.activeElement))
            close();
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) close();
        }}
        onKeyDown={() => {
          keyboard.current = true;
        }}
        onPointerMove={(e) => {
          if (canHover(e)) {
            keyboard.current = false;
            const item = (e.target as Element).closest<HTMLElement>(
              "[data-menu-item]",
            );
            if (item && open) setActive(Number(item.dataset.menuItem));
          }
        }}
      >
        <button
          type="button"
          ref={toggle}
          data-menu-toggle=""
          className="ttg-menu-toggle"
          aria-expanded={open}
          aria-controls="ttg-menu-list"
          onFocus={() => {
            if (
              !closing.current &&
              !pointerFocus.current &&
              matchMedia("(min-width:1280px)").matches
            )
              setOpen(true);
          }}
          onClick={(e) => {
            if (
              e.detail !== 0 &&
              matchMedia("(any-hover:hover) and (any-pointer:fine)").matches
            )
              setOpen(true);
            else if (open) close();
            else setOpen(true);
          }}
        >
          <HeaderIcon name="menu" />
          <span className="ttg-menu-label">DANH MỤC SẢN PHẨM</span>
        </button>
        <div
          data-menu-content=""
          id="ttg-menu-list"
          className="ttg-menu-content"
          hidden={!open}
        >
          <ul className="ttg-menu-list">
            {headerData.categories.map((c, i) => {
              const expanded = active === i && c.groups.length > 0;
              const attrs = {
                className: undefined,
                "aria-controls": c.groups.length ? `mega-${i}` : undefined,
                "aria-expanded": c.groups.length ? expanded : undefined,
                onFocus: () => {
                  if (!pointerFocus.current) {
                    keyboard.current = true;
                    if (open) setActive(i);
                  }
                },
              };
              return (
                <li
                  key={i}
                  data-menu-item={i}
                  className={`ttg-menu-item${active === i ? " is-active" : ""}`}
                  onPointerEnter={(e) => {
                    if (canHover(e) && open && !keyboard.current) setActive(i);
                  }}
                >
                  {categoryHref(c.name) === "#" ? (
                    <Link prefetch={false} href={routes.catalog} {...attrs}>
                      {c.name}
                      {c.groups.length > 0 && (
                        <span className="ttg-chevron" aria-hidden="true" />
                      )}
                    </Link>
                  ) : (
                    <Link
                      prefetch={false}
                      href={categoryHref(c.name)}
                      {...attrs}
                    >
                      {c.name}
                      {c.groups.length > 0 && (
                        <span className="ttg-chevron" aria-hidden="true" />
                      )}
                    </Link>
                  )}
                  {c.groups.length > 0 && (
                    <>
                      <button
                        type="button"
                        data-menu-accordion={i}
                        className="ttg-accordion"
                        aria-label={`Mở danh mục con ${c.name}`}
                        aria-expanded={expanded}
                        aria-controls={`mega-${i}`}
                        onClick={() => setActive(expanded ? -1 : i)}
                      >
                        <Icon />
                      </button>
                      <div data-mobile-panel={i}>
                        <div
                          id={`mega-${i}`}
                          data-mega-panel={i}
                          className="ttg-mega"
                          hidden={!expanded}
                        >
                          <div className="ttg-mega-main">
                            <div className="ttg-mega-groups">
                              {c.groups.map((g, j) => (
                                <Group
                                  key={j}
                                  group={g}
                                  id={`menu-group-${i}-${j}`}
                                />
                              ))}
                            </div>
                            <div
                              className="ttg-brands"
                              aria-label={`Thương hiệu ${c.name}`}
                            >
                              {c.brands.map((b, j) => (
                                <Link
                                  prefetch={false}
                                  href={routes.catalog}
                                  key={j}
                                  aria-label={b.name}
                                >
                                  {b.image ? (
                                    <AssetImage image={b.image} alt={b.name} />
                                  ) : (
                                    b.name
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                          {c.banner && (
                            <Link
                              prefetch={false}
                              href={routes.catalog}
                              className="ttg-menu-banner"
                            >
                              <AssetImage
                                image={c.banner}
                                alt={`Banner ${c.name}`}
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="ttg-shortcuts">
        {headerData.shortcuts.map((s, i) => {
          const children = (
            <>
              <span>
                <AssetImage image={s.image} />
              </span>
              {s.name}
            </>
          );
          return categoryHref(s.name) === "#" ? (
            <Link
              prefetch={false}
              href={routes.catalog}
              key={i}
              className={i === 5 ? "ttg-shortcut-ai" : undefined}
            >
              {children}
            </Link>
          ) : (
            <Link prefetch={false} key={i} href={categoryHref(s.name)}>
              {children}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
