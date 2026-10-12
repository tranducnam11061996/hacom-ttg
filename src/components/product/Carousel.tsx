"use client";

import { useRef, type ReactNode } from "react";
import { useCarousel } from "@/hooks/useCarousel";
import { Icon } from "@/components/ui/Icon";

export function Carousel({
  children,
  id,
  label,
  sale = false,
  active = true,
  initialIndex = 0,
}: {
  children: ReactNode;
  id: string;
  label: string;
  sale?: boolean;
  active?: boolean;
  initialIndex?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useCarousel(ref, { draggable: sale, enabled: active, initialIndex });
  return (
    <div
      ref={ref}
      data-category-carousel=""
      data-sale-carousel={sale ? "" : undefined}
      className={`category-carousel${sale ? " sale-carousel" : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Sản phẩm ${label}`}
    >
      <div data-category-track="" id={id} className="category-track">
        {children}
      </div>
      <button
        type="button"
        data-category-prev=""
        aria-controls={id}
        aria-label={`Sản phẩm trước — ${label}`}
        className="category-arrow category-prev"
        hidden
      >
        <span className="inline-block rotate-180">
          <Icon />
        </span>
      </button>
      <button
        type="button"
        data-category-next=""
        aria-controls={id}
        aria-label={`Sản phẩm tiếp theo — ${label}`}
        className="category-arrow category-next"
        hidden
      >
        <Icon />
      </button>
    </div>
  );
}
