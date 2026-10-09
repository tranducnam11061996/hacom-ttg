"use client";

import { useEffect, type RefObject } from "react";

function ease(value: number) {
  let low = 0,
    high = 1,
    t = value;
  const curve = (a: number, b: number, u: number) =>
    3 * (1 - u) ** 2 * u * a + 3 * (1 - u) * u ** 2 * b + u ** 3;
  for (let i = 0; i < 12; i++) {
    t = (low + high) / 2;
    if (curve(0.25, 0.25, t) < value) low = t;
    else high = t;
  }
  return curve(0.1, 1, t);
}

/** Each carousel owns its observers, drag state, animation and autoplay lifecycle. */
export function useCarousel(
  ref: RefObject<HTMLElement | null>,
  { hero = false, draggable = false, enabled = true, initialPosition = 0 } = {},
) {
  useEffect(() => {
    if (!enabled) return;
    const rail = ref.current;
    const track = rail?.querySelector<HTMLElement>(
      "[data-category-track], [data-hero-track]",
    );
    if (!rail || !track) return;
    const abort = new AbortController(),
      signal = abort.signal;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const buttons = [
      ...rail.querySelectorAll<HTMLButtonElement>(
        "[data-category-prev], [data-category-next]",
      ),
    ];
    const pause = rail.querySelector<HTMLButtonElement>("[data-hero-pause]");
    let step = 0,
      maxIndex = 0,
      maxScroll = 0,
      inView = false,
      index = 0;
    let measured = false;
    let measureFrame = 0,
      needsMeasure = true;
    let timer: ReturnType<typeof setTimeout> | undefined,
      settle: ReturnType<typeof setTimeout> | undefined,
      clickTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0,
      programmaticUntil = 0,
      interacting = false,
      dragging = false,
      hovered = false,
      focused = false,
      paused = false;
    let drag:
        | { id: number; x: number; y: number; left: number; moved: boolean }
        | undefined,
      suppressClick = false;
    function stop() {
      clearTimeout(timer);
    }
    function cancel() {
      stop();
      cancelAnimationFrame(frame);
      frame = 0;
      track!.style.removeProperty("scroll-snap-type");
    }
    function schedule() {
      stop();
      if (
        inView &&
        maxIndex &&
        !document.hidden &&
        !motion.matches &&
        !hovered &&
        !focused &&
        !interacting &&
        !dragging &&
        !paused &&
        !frame
      )
        timer = setTimeout(() => move(1), 3500);
    }
    function select(next: number) {
      index = next;
      if (!hero) return;
      [...track!.children].forEach((el, i) => {
        const slide = el as HTMLElement;
        slide.tabIndex = i === index ? 0 : -1;
        slide.setAttribute("aria-current", String(i === index));
      });
      const image =
        track!.children[(index + 1) % track!.children.length]?.querySelector(
          "img",
        );
      if (image) image.loading = "eager";
    }
    function current() {
      return step
        ? Math.min(maxIndex, Math.round(track!.scrollLeft / step))
        : 0;
    }
    function move(delta: number, absolute?: number) {
      const old = hero ? index : current();
      cancel();
      clearTimeout(settle);
      const next =
        absolute ??
        (old + delta > maxIndex ? 0 : old + delta < 0 ? maxIndex : old + delta);
      const target = Math.min(Math.max(0, next) * step, maxScroll),
        from = track!.scrollLeft;
      select(Math.max(0, Math.min(next, maxIndex)));
      const image = track!.children[index]?.querySelector("img");
      if (hero && image) image.loading = "eager";
      if (motion.matches || Math.abs(target - from) < 1) {
        track!.scrollLeft = target;
        programmaticUntil = performance.now() + 80;
        schedule();
        return;
      }
      track!.style.scrollSnapType = "none";
      const started = performance.now();
      function tick(now: number) {
        const progress = Math.min(1, (now - started) / 1000);
        track!.scrollLeft = from + (target - from) * ease(progress);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else {
          frame = 0;
          track!.scrollLeft = target;
          programmaticUntil = now + 80;
          track!.style.removeProperty("scroll-snap-type");
          schedule();
        }
      }
      frame = requestAnimationFrame(tick);
    }
    function measure() {
      const previous = measured ? (hero ? index : current()) : -1;
      step = hero
        ? track!.clientWidth + 10
        : (track!.firstElementChild?.getBoundingClientRect().width ?? 0) + 10;
      const slots = hero ? 1 : Math.round((track!.clientWidth + 10) / step);
      maxIndex = Math.max(0, track!.children.length - slots);
      maxScroll = Math.max(0, track!.scrollWidth - track!.clientWidth);
      cancel();
      needsMeasure = false;
      buttons.forEach((button) => {
        button.hidden = !maxIndex;
      });
      programmaticUntil = performance.now() + 80;
      select(
        Math.min(
          previous < 0 ? Math.round(initialPosition / step) : previous,
          maxIndex,
        ),
      );
      measured = true;
      track!.scrollLeft = index * step;
      schedule();
    }
    function queueMeasure() {
      needsMeasure = true;
      if (inView && !measureFrame)
        measureFrame = requestAnimationFrame(() => {
          measureFrame = 0;
          measure();
        });
    }
    function interact() {
      cancel();
      interacting = true;
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (dragging) return;
        interacting = false;
        select(current());
        schedule();
      }, 200);
    }
    buttons.forEach((button) =>
      button.addEventListener(
        "click",
        () => move(button.hasAttribute("data-category-prev") ? -1 : 1),
        { signal },
      ),
    );
    rail.addEventListener(
      "pointerenter",
      (e) => {
        if (e.pointerType !== "touch") {
          hovered = true;
          stop();
        }
      },
      { signal },
    );
    rail.addEventListener(
      "pointerleave",
      () => {
        hovered = false;
        schedule();
      },
      { signal },
    );
    rail.addEventListener(
      "focusin",
      () => {
        focused = true;
        cancel();
      },
      { signal },
    );
    rail.addEventListener(
      "focusout",
      (e) => {
        focused = rail.contains(e.relatedTarget as Node);
        schedule();
      },
      { signal },
    );
    track.addEventListener(
      "pointerdown",
      (e) => {
        dragging = true;
        interact();
        if (
          (hero || draggable) &&
          e.button === 0 &&
          (hero || e.pointerType === "mouse")
        )
          drag = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            left: track.scrollLeft,
            moved: false,
          };
      },
      { signal, passive: true },
    );
    track.addEventListener(
      "pointermove",
      (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        const dx = e.clientX - drag.x,
          dy = e.clientY - drag.y;
        if (
          !drag.moved &&
          Math.abs(dx) > 6 &&
          (!hero || Math.abs(dx) > Math.abs(dy))
        ) {
          drag.moved = true;
          track.setPointerCapture(e.pointerId);
          track.style.scrollSnapType = "none";
          rail.classList.add("is-dragging");
        }
        if (drag.moved) {
          e.preventDefault();
          track.scrollLeft = drag.left - dx;
        }
      },
      { signal },
    );
    function release() {
      if (!dragging) return;
      const moved = drag?.moved;
      drag = undefined;
      dragging = false;
      rail!.classList.remove("is-dragging");
      if (moved) {
        suppressClick = true;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(
          () => {
            suppressClick = false;
          },
          hero ? 100 : 0,
        );
        interacting = false;
        move(0, current());
      } else interact();
    }
    window.addEventListener("pointerup", release, { signal });
    window.addEventListener("pointercancel", release, { signal });
    track.addEventListener("dragstart", (e) => e.preventDefault(), { signal });
    rail.addEventListener(
      "click",
      (e) => {
        if (suppressClick) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick = false;
        }
      },
      { signal, capture: true },
    );
    track.addEventListener("wheel", interact, { signal, passive: true });
    track.addEventListener(
      "scroll",
      () => {
        if (!frame && !drag && performance.now() > programmaticUntil)
          interact();
      },
      { signal, passive: true },
    );
    rail.addEventListener(
      "keydown",
      (e) => {
        const delta =
          e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
        if (delta || (!hero && ["Home", "End"].includes(e.key))) {
          e.preventDefault();
          move(
            delta,
            e.key === "Home" ? 0 : e.key === "End" ? maxIndex : undefined,
          );
        }
      },
      { signal },
    );
    pause?.addEventListener(
      "click",
      () => {
        paused = !paused;
        pause!.setAttribute("aria-pressed", String(paused));
        pause!.textContent = paused
          ? "Tiếp tục trình chiếu"
          : "Dừng trình chiếu";
        schedule();
      },
      { signal },
    );
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancel();
        else schedule();
      },
      { signal },
    );
    motion.addEventListener(
      "change",
      () => {
        cancel();
        move(0, index);
      },
      { signal },
    );
    const visibility = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        if (inView) {
          if (needsMeasure) measure();
          else schedule();
        } else cancel();
      },
      { threshold: 0.01 },
    );
    const resize = new ResizeObserver(queueMeasure);
    visibility.observe(rail);
    resize.observe(track);
    return () => {
      cancel();
      cancelAnimationFrame(measureFrame);
      clearTimeout(settle);
      clearTimeout(clickTimer);
      abort.abort();
      visibility.disconnect();
      resize.disconnect();
    };
  }, [ref, hero, draggable, enabled, initialPosition]);
}
