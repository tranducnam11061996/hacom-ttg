"use client";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { Content } from "@/components/ui/Content";
type Point = {
  x: number;
  y: number;
  scrollX: number;
  scrollY: number;
  keyboard: boolean;
};
export function ProductTooltip({
  html,
  href,
  children,
}: {
  html: string;
  href: string;
  children: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLAnchorElement>(null),
    tip = useRef<HTMLDivElement>(null);
  const point = useRef<Point | null>(null),
    size = useRef<{ width: number; height: number } | null>(null);
  const frame = useRef(0),
    dismissed = useRef(false);
  const paint = useCallback(() => {
    const p = point.current,
      el = tip.current;
    if (!p || !el) return;
    if (!size.current) {
      const r = el.getBoundingClientRect(),
        s = getComputedStyle(el);
      size.current = {
        width: r.width,
        height:
          r.height -
          parseFloat(s.paddingTop) -
          parseFloat(s.paddingBottom) -
          parseFloat(s.borderTopWidth) -
          parseFloat(s.borderBottomWidth),
      };
    }
    const { width, height } = size.current;
    el.style.left =
      (p.x + width > innerWidth ? p.x - width - 10 : p.x + 10) +
      p.scrollX +
      "px";
    el.style.top =
      (p.y - height < 0 ? 0 : p.y - height - 10) + p.scrollY + "px";
  }, []);
  const schedule = useCallback(() => {
    if (!frame.current)
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        paint();
      });
  }, [paint]);
  function show(x: number, y: number, keyboard = false) {
    if (innerWidth < 768 || dismissed.current) return;
    point.current = { x, y, scrollX, scrollY, keyboard };
    if (!open) setOpen(true);
    else schedule();
  }
  useLayoutEffect(() => {
    if (open) paint();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      size.current = null;
    };
  }, [open, paint]);
  useEffect(() => {
    if (!open) return;
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dismissed.current = true;
        setOpen(false);
      }
    }
    function resize() {
      if (innerWidth < 768) {
        setOpen(false);
        return;
      }
      const p = point.current;
      if (p && anchor.current) {
        const r = p.keyboard ? anchor.current.getBoundingClientRect() : null;
        point.current = {
          ...p,
          ...(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : {}),
          scrollX,
          scrollY,
        };
        size.current = null;
        schedule();
      }
    }
    const abort = new AbortController();
    document.addEventListener("keydown", escape, { signal: abort.signal });
    window.addEventListener("resize", resize, { signal: abort.signal });
    document.fonts.addEventListener("loadingdone", resize, {
      signal: abort.signal,
    });
    return () => abort.abort();
  }, [open, schedule]);
  return (
    <>
      <Link
        prefetch={false}
        href={href}
        ref={anchor}
        className="category-image"
        data-product-hover=""
        aria-describedby={open ? id : undefined}
        onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
          dismissed.current = false;
          show(e.clientX, e.clientY);
        }}
        onMouseMove={(e: MouseEvent<HTMLAnchorElement>) =>
          show(e.clientX, e.clientY)
        }
        onMouseLeave={() => {
          setOpen(false);
          dismissed.current = false;
        }}
        onFocus={() => {
          dismissed.current = false;
          const r = anchor.current!.getBoundingClientRect();
          show(r.left + r.width / 2, r.top + r.height / 2, true);
        }}
        onBlur={() => {
          setOpen(false);
          dismissed.current = false;
        }}
      >
        {children}
      </Link>
      {open &&
        createPortal(
          <div className="listing-tooltip-layer">
            <Content
              className="listing-tooltip"
              id={id}
              role="tooltip"
              ref={tip}
              html={html}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
