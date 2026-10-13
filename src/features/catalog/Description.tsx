"use client";
import { useState } from "react";
import { Content } from "@/components/ui/Content";
export function Description({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="listing-description">
      <div
        id="listing-description-content"
        className={`listing-description-content${expanded ? " expanded" : ""}`}
      >
        <Content html={html} />
      </div>
      <div className="listing-description-action">
        <button
          type="button"
          data-description-toggle=""
          aria-expanded={expanded}
          aria-controls="listing-description-content"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
          <svg
            aria-hidden="true"
            height="16"
            width="16"
            viewBox="0 -960 960 960"
          >
            <path
              fill="currentColor"
              d="M480-192 240-432l51-51 189 189 189-189 51 51-240 240Zm0-285L240-717l51-51 189 189 189-189 51 51-240 240Z"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
