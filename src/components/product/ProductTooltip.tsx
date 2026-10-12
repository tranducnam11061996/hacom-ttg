"use client";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Content } from "@/components/ui/Content";
type Point = { x: number; y: number; scrollX: number; scrollY: number; keyboard: boolean };
export function ProductTooltip({ items, children }: { items: { key: string; html: string }[]; children: ReactNode }) {
  const id = useId();
  const html = useMemo(() => new Map(items.map(item => [item.key, item.html])), [items]);
  const [active, setActive] = useState<string | null>(null);
  const anchor = useRef<HTMLAnchorElement | null>(null), tip = useRef<HTMLDivElement>(null);
  const point = useRef<Point | null>(null), size = useRef<{ width: number; height: number } | null>(null);
  const frame = useRef(0), dismissed = useRef<HTMLAnchorElement | null>(null);
  const currentKey = useRef<string | null>(null);
  const paint = useCallback(() => {
    const p = point.current, el = tip.current;
    if (!p || !el) return;
    if (!size.current) {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      size.current = { width: r.width, height: r.height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) - parseFloat(s.borderTopWidth) - parseFloat(s.borderBottomWidth) };
    }
    const { width, height } = size.current;
    el.style.left = (p.x + width > innerWidth ? p.x - width - 10 : p.x + 10) + p.scrollX + "px";
    el.style.top = (p.y - height < 0 ? 0 : p.y - height - 10) + p.scrollY + "px";
  }, []);
  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; paint(); });
  }, [paint]);
  const close = useCallback(() => {
    anchor.current?.removeAttribute("aria-describedby"); anchor.current = null; currentKey.current = null; setActive(null);
  }, []);
  function target(node: EventTarget | null) {
    return node instanceof Element ? node.closest<HTMLAnchorElement>("a[data-tooltip-key]") : null;
  }
  function show(el: HTMLAnchorElement, x: number, y: number, keyboard = false) {
    const key = el.dataset.tooltipKey!;
    if (innerWidth < 768 || dismissed.current === el || !html.has(key)) return;
    if (anchor.current !== el) { anchor.current?.removeAttribute("aria-describedby"); size.current = null; }
    anchor.current = el; el.setAttribute("aria-describedby", id);
    point.current = { x, y, scrollX, scrollY, keyboard };
    if (currentKey.current !== key) { currentKey.current = key; setActive(key); }
    schedule();
  }
  useLayoutEffect(() => {
    if (active) paint();
    return () => { cancelAnimationFrame(frame.current); frame.current = 0; size.current = null; };
  }, [active, paint]);
  useEffect(() => {
    if (!active) return;
    function resize() {
      if (innerWidth < 768) { close(); return; }
      const p = point.current, el = anchor.current;
      if (p && el) {
        const r = p.keyboard ? el.getBoundingClientRect() : null;
        point.current = { ...p, ...(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : {}), scrollX, scrollY };
        size.current = null; schedule();
      }
    }
    const abort = new AbortController();
    document.addEventListener("keydown", event => { if (event.key === "Escape") { dismissed.current = anchor.current; close(); } }, { signal: abort.signal });
    window.addEventListener("resize", resize, { signal: abort.signal });
    document.fonts.addEventListener("loadingdone", resize, { signal: abort.signal });
    return () => abort.abort();
  }, [active, close, schedule]);
  useEffect(() => () => { anchor.current?.removeAttribute("aria-describedby"); cancelAnimationFrame(frame.current); }, []);
  return <>
    <div style={{ display: "contents" }}
      onPointerOver={event => { const el = target(event.target); if (el && event.pointerType !== "touch" && !el.contains(event.relatedTarget as Node | null)) show(el, Math.trunc(event.clientX), Math.trunc(event.clientY)); }}
      onPointerMove={event => { const el = target(event.target); if (el && event.pointerType !== "touch") show(el, Math.trunc(event.clientX), Math.trunc(event.clientY)); }}
      onPointerOut={event => { const el = target(event.target); if (el && !el.contains(event.relatedTarget as Node | null)) { dismissed.current = null; close(); } }}
      onFocusCapture={event => { const el = target(event.target); if (el) { dismissed.current = null; const r = el.getBoundingClientRect(); show(el, r.left + r.width / 2, r.top + r.height / 2, true); } }}
      onBlurCapture={event => { if (target(event.target)) { dismissed.current = null; close(); } }}
    >{children}</div>
    {active && createPortal(<div className="listing-tooltip-layer"><Content className="listing-tooltip" id={id} role="tooltip" ref={tip} html={html.get(active)!} /></div>, document.body)}
  </>;
}
