"use client";

import { useDemo } from "./Demo";
import type { ComponentProps } from "react";

/** HTML is limited to sanitized, local editorial content stored with the demo data. */
export function Content({
  html,
  onClick,
  ...props
}: ComponentProps<"div"> & { html: string }) {
  const notify = useDemo();
  return (
    <div
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if ((event.target as Element).closest('a[href="#"], [data-demo]')) {
          event.preventDefault();
          notify();
        }
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
