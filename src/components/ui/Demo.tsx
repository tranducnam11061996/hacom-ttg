"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";

const message = "Đây là giao diện demo TGB SHOP. Chức năng mua hàng chưa được kết nối.";
const DemoContext = createContext<() => void>(() => {});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notify = useCallback(() => {
    clearTimeout(timer.current);
    const dialog = document.querySelector<HTMLDialogElement>("dialog[open]");
    const status = dialog?.querySelector<HTMLElement>("[data-demo-status]");
    if (status) {
      status.hidden = false;
      status.textContent = message;
    }
    setDialogMessage(Boolean(status));
    setVisible(true);
    timer.current = setTimeout(() => {
      setVisible(false);
      if (status) status.hidden = true;
    }, 4000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <DemoContext.Provider value={notify}>
      {children}
      <p
        id="demo-status"
        className="fixed bottom-3 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-lg bg-secondary px-4 py-3 text-sm text-white"
        role="status"
        hidden={!visible || dialogMessage}
      >
        {visible ? message : ""}
      </p>
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);
export function DemoButton({
  onClick,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const notify = useDemo();
  return (
    <button
      {...props}
      type={type}
      data-demo=""
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
        notify();
      }}
    />
  );
}
export function DemoLink({
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const notify = useDemo();
  return (
    <a
      {...props}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
        notify();
      }}
    />
  );
}
export function DemoForm({
  onSubmit,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  const notify = useDemo();
  return (
    <form
      {...props}
      data-demo-form=""
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
        notify();
      }}
    />
  );
}
