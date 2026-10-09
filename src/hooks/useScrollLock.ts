"use client";
import { useEffect } from "react";

/** Preserve the current layout and inline styles while a modal blocks page scrolling. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const body = document.body;
    const root = document.documentElement;
    const overflow = body.style.overflow,
      padding = body.style.paddingRight,
      gutter = root.style.scrollbarGutter;
    const scrollbar = innerWidth - root.getBoundingClientRect().width;
    const currentPadding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    if (scrollbar > 0) {
      if (CSS.supports("scrollbar-gutter", "stable")) {
        if (!getComputedStyle(root).scrollbarGutter.includes("stable"))
          root.style.scrollbarGutter = "stable";
      } else {
        body.style.paddingRight = `${currentPadding + scrollbar}px`;
      }
    }
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = padding;
      root.style.scrollbarGutter = gutter;
    };
  }, [locked]);
}
