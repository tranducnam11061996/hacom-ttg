"use client";

import { useRef } from "react";
import type { Banner } from "./types";
import { AssetImage } from "@/components/ui/AssetImage";
import { DemoLink } from "@/components/ui/Demo";
import { useCarousel } from "@/hooks/useCarousel";

export function Hero({ banners }: { banners: Banner[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useCarousel(ref, { hero: true, draggable: true });
  const image = (h: Banner, i: number) => (
    <AssetImage
      image={h.image}
      alt={h.alt}
      eager={i === 0}
      fetchPriority={i === 0 ? "high" : undefined}
      sizes={
        i < 0
          ? "(min-width:1620px) 525px, (min-width:1280px) 390px, calc((100vw - 48px) / 3)"
          : "(min-width:1620px) 1600px, (min-width:1280px) 1200px, calc(100vw - 24px)"
      }
    />
  );
  return (
    <section className="ttg-hero-section" aria-label="Ưu đãi TTG">
      <div
        ref={ref}
        data-hero=""
        className="ttg-hero"
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner khuyến mãi"
        tabIndex={0}
      >
        <div data-hero-track="" className="ttg-hero-track">
          {banners.slice(0, 9).map((h, i) => (
            <DemoLink
              key={i}
              className="ttg-slide"
              aria-label={`Banner ${i + 1} trên 9`}
              tabIndex={i ? -1 : undefined}
            >
              {image(h, i)}
            </DemoLink>
          ))}
        </div>
        <button
          type="button"
          data-hero-pause=""
          className="ttg-hero-pause"
          aria-pressed="false"
        >
          Dừng trình chiếu
        </button>
      </div>
      <div className="ttg-secondary-banners">
        {banners.slice(9).map((h, i) => (
          <DemoLink key={i}>
            <picture>
              <source media="(min-width: 801px)" srcSet={h.image.src} />
              {image(h, -1)}
            </picture>
          </DemoLink>
        ))}
      </div>
    </section>
  );
}
