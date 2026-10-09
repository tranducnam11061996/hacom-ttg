"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "@/data";
import { AssetImage, type ImageAsset } from "@/components/ui/AssetImage";
import { DemoButton, DemoForm, DemoLink } from "@/components/ui/Demo";
import { HeaderIcon, Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/routes";
import { Menu } from "./Menu";

function Support({
  support,
  index,
}: {
  support: (typeof headerData.support)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  useEffect(() => {
    const abort = new AbortController();
    document.addEventListener(
      "click",
      (e) => {
        if (!root.current?.contains(e.target as Node)) setOpen(false);
      },
      { signal: abort.signal },
    );
    return () => abort.abort();
  }, []);
  return (
    <div
      className="ttg-support"
      data-support=""
      ref={root}
      onPointerEnter={(e) => {
        if (
          e.pointerType !== "touch" &&
          matchMedia("(min-width:1280px)").matches
        )
          setOpen(true);
      }}
      onPointerLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onFocus={() => {
        if (!closing.current && matchMedia("(min-width:1280px)").matches)
          setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          closing.current = true;
          setOpen(false);
          button.current?.focus();
          closing.current = false;
        }
      }}
    >
      <button
        ref={button}
        type="button"
        className="ttg-pill"
        aria-expanded={open}
        aria-controls={`support-${index}`}
        onClick={() =>
          setOpen(matchMedia("(min-width:1280px)").matches || !open)
        }
      >
        <HeaderIcon name={index ? "sales" : "location"} />
        {support.name}
      </button>
      <div id={`support-${index}`} className="ttg-support-panel" hidden={!open}>
        {support.sections.map((s, i) => (
          <section key={i}>
            <p className="ttg-support-title">{s.title}</p>
            {s.lines.map((line, j) => (
              <DemoLink key={j}>{line}</DemoLink>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

type HeaderProps = {
  logo: ImageAsset;
  searchCategories: string[];
  cartItemsCount: number;
};
function HeaderContent({
  cartCount,
  logo,
  searchCategories,
}: HeaderProps & { cartCount: number }) {
  const space = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = header.current!,
      placeholder = space.current!;
    const abort = new AbortController();
    let frame = 0,
      expandedHeight = 0,
      measuredWidth = 0;
    function measure() {
      const compact = element.classList.contains("is-compact");
      const inner = element.querySelector<HTMLElement>(".ttg-header-inner")!;
      const width = inner.getBoundingClientRect().width;
      if (!compact) expandedHeight = element.getBoundingClientRect().height;
      else if (width !== measuredWidth || !expandedHeight) {
        // Measure the normal layout only on a compact resize, without changing the visible header.
        const clone = element.cloneNode(true) as HTMLElement;
        clone.classList.remove("is-compact");
        clone.inert = true;
        clone.style.cssText =
          "position:fixed;inset:0 0 auto;visibility:hidden;pointer-events:none";
        placeholder.append(clone);
        expandedHeight = clone.getBoundingClientRect().height;
        clone.remove();
      }
      measuredWidth = width;
      const height = `${expandedHeight}px`,
        contentWidth = `${width - 20}px`;
      if (placeholder.style.height !== height)
        placeholder.style.height = height;
      if (
        element.style.getPropertyValue("--header-content-width") !==
        contentWidth
      )
        element.style.setProperty("--header-content-width", contentWidth);
    }
    function scheduleMeasure() {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          measure();
        });
    }
    function scroll() {
      const compact = window.scrollY > 500;
      if (element.classList.contains("is-compact") !== compact) {
        element.classList.toggle("is-compact", compact);
        if (!compact) scheduleMeasure();
      }
    }
    function visibility() {
      element.classList.toggle("motion-paused", document.hidden);
    }
    const resize = new ResizeObserver(scheduleMeasure);
    resize.observe(element);
    window.addEventListener("resize", scheduleMeasure, {
      signal: abort.signal,
    });
    document.fonts.addEventListener("loadingdone", scheduleMeasure, {
      signal: abort.signal,
    });
    window.addEventListener("scroll", scroll, {
      passive: true,
      signal: abort.signal,
    });
    document.addEventListener("visibilitychange", visibility, {
      signal: abort.signal,
    });
    measure();
    scroll();
    visibility();
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      abort.abort();
    };
  }, []);
  return (
    <div data-header-space="" ref={space}>
      <header ref={header} data-header="" className="ttg-header">
        <div className="ttg-top">
          <div className="ttg-container ttg-top-inner">
            <div className="ttg-support-links">
              {headerData.support.map((s, i) => (
                <Support key={i} support={s} index={i} />
              ))}
              <DemoLink>Trang tin công nghệ</DemoLink>
              <DemoLink className="ttg-pill">
                <Icon name="game" className="" width="20" height="20" />
                TƯ VẤN BUILD PC
              </DemoLink>
              <DemoLink>Phần mềm hay</DemoLink>
            </div>
            <div className="ttg-account">
              <DemoLink>Đăng ký</DemoLink>
              <span aria-hidden="true">|</span>
              <DemoLink>Đăng nhập</DemoLink>
            </div>
          </div>
        </div>
        <div className="ttg-container ttg-header-inner">
          <div className="ttg-middle">
            <Link
              prefetch={false}
              href={routes.home}
              className="ttg-logo"
              aria-label="TTG Shop trang chủ"
            >
              <AssetImage
                image={logo}
                alt="TTG SHOP"
                eager
                fetchPriority={undefined}
              />
            </Link>
            <DemoForm className="ttg-search" aria-label="Tìm kiếm demo">
              <label htmlFor="search-category" className="sr-only">
                Danh mục tìm kiếm
              </label>
              <select id="search-category">
                {searchCategories.map((name, i) => (
                  <option key={i} value={i}>
                    {name}
                  </option>
                ))}
              </select>
              <label htmlFor="search" className="sr-only">
                Tìm kiếm sản phẩm
              </label>
              <input
                id="search"
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
              />
              <button type="submit" aria-label="Tìm kiếm demo">
                <HeaderIcon name="search" />
              </button>
              <div className="ttg-search-hints">
                <Link prefetch={false} href={routes.catalog}>
                  PC Gaming
                </Link>
                <Link prefetch={false} href={routes.catalog}>
                  Linh kiện máy tính
                </Link>
                <Link prefetch={false} href={routes.catalog}>
                  Màn hình
                </Link>
              </div>
            </DemoForm>
            <div className="ttg-featured">
              <DemoButton className="ttg-feature">
                <span className="ttg-feature-icon">
                  <HeaderIcon name="phone" />
                </span>
                <span>
                  Hotline mua hàng
                  <br />
                  088.697.6868
                </span>
              </DemoButton>
              <Link
                prefetch={false}
                href={routes.buildPc}
                className="ttg-feature ttg-build"
              >
                <span className="ttg-feature-icon">
                  <HeaderIcon name="computer" />
                </span>
                <span>
                  Xây dựng
                  <br />
                  Cấu hình PC
                </span>
              </Link>
              <Link
                prefetch={false}
                href={routes.cart}
                className="ttg-feature ttg-cart"
                aria-label="Giỏ hàng"
              >
                <span className="ttg-cart-badge" hidden={!cartCount}>
                  {cartCount || ""}
                </span>
                <span className="ttg-feature-icon">
                  <HeaderIcon name="cart" />
                </span>
                <span>Giỏ hàng</span>
              </Link>
            </div>
          </div>
          <Menu />
        </div>
      </header>
    </div>
  );
}

export function Header(props: HeaderProps) {
  const pathname = usePathname();
  return (
    <HeaderContent
      {...props}
      key={pathname}
      cartCount={pathname === routes.cart ? props.cartItemsCount : 0}
    />
  );
}
