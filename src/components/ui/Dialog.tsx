"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

/** The native modal handles focus containment; the effect restores focus and scroll on every exit. */
export function Dialog({
  id,
  className,
  titleId,
  onClose,
  children,
}: {
  id: string;
  className?: string;
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    callback = useRef(onClose);
  useScrollLock(true);
  useEffect(() => {
    callback.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const dialog = ref.current!,
      trigger = document.activeElement as HTMLElement | null;
    const search = dialog.querySelector<HTMLInputElement>('input[type="search"]');
    if (search) search.autofocus = true;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      id={id}
      className={className}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        callback.current();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current!.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            callback.current();
        }
      }}
    >
      {children}
    </dialog>
  );
}
