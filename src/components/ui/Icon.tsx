import type { SVGProps } from "react";
const icons = {
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  phone: <path d="M8 3 4 5c-2 7 8 17 15 15l2-4-5-3-2 2c-3-1-5-3-6-6l2-2Z" />,
  location: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  computer: <><rect x="2" y="3" width="15" height="12" rx="1" /><path d="M6 20h7M9 15v5" /><rect x="19" y="5" width="3" height="15" rx="1" /></>,
  sales: <><circle cx="8" cy="7" r="3" /><path d="M2 20v-4a6 6 0 0 1 12 0v4M16 7h6M19 4v6M16 14h6" /></>,
  delivery: <><path d="M2 5h12v12H2ZM14 9h4l4 5v3h-8M1 9h7M1 13h5" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
  return: <><path d="M4 10a8 8 0 1 1 0 7M4 4v6h6" /><path d="m9 14 3 3 5-5" /></>,
  headset: <><path d="M3 13v-2a9 9 0 0 1 18 0v2M21 18c0 3-4 4-7 4" /><rect x="2" y="12" width="4" height="7" rx="2" /><rect x="18" y="12" width="4" height="7" rx="2" /></>,
  flame: <path d="M13 2c1 6-4 6-3 11 2-1 3-3 4-4 4 4 7 7 5 11-3 5-12 4-14-1-2-6 3-10 5-14 0 3 1 4 2 4 2-2 1-4 1-7Z" />,
  arrow: (
    <>
      <path d="m9 5 7 7-7 7"></path>
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6"></circle>
      <path d="m15 15 6 6"></path>
    </>
  ),
  cart: (
    <>
      <path d="M2 3h3l3 13h11l3-9H6"></path>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="19" cy="21" r="1"></circle>
    </>
  ),
  play: (
    <>
      <path d="m8 4 12 8-12 8Z"></path>
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 10v8M14 10v8"></path>
    </>
  ),
  print: (
    <>
      <path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 14h10v7H7z"></path>
      <path d="M17 11h1"></path>
    </>
  ),
  excel: (
    <>
      <path d="M7 2h9l4 4v16H7zM16 2v5h4M3 9h10v10H3zM5 11l6 6M11 11l-6 6"></path>
    </>
  ),
  check: (
    <>
      <path d="m4 12 5 5L20 6"></path>
    </>
  ),
  card: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="1"></rect>
      <path d="M2 9h20M5 15h5"></path>
    </>
  ),
  ticket: (
    <>
      <path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM8 6v12"></path>
    </>
  ),
  game: (
    <>
      <path d="M192 176C112.5 176 48 240.5 48 320C48 399.5 112.5 464 192 464L448 464C527.5 464 592 399.5 592 320C592 240.5 527.5 176 448 176L192 176zM0 320C0 214 86 128 192 128L448 128C554 128 640 214 640 320C640 426 554 512 448 512L192 512C86 512 0 426 0 320zM232 264L232 296L264 296C277.3 296 288 306.7 288 320C288 333.3 277.3 344 264 344L232 344L232 376C232 389.3 221.3 400 208 400C194.7 400 184 389.3 184 376L184 344L152 344C138.7 344 128 333.3 128 320C128 306.7 138.7 296 152 296L184 296L184 264C184 250.7 194.7 240 208 240C221.3 240 232 250.7 232 264zM400 336C417.7 336 432 350.3 432 368C432 385.7 417.7 400 400 400C382.3 400 368 385.7 368 368C368 350.3 382.3 336 400 336zM432 272C432 254.3 446.3 240 464 240C481.7 240 496 254.3 496 272C496 289.7 481.7 304 464 304C446.3 304 432 289.7 432 272z"></path>
    </>
  ),
  combo: (
    <>
      <path d="M0 72C0 58.7 10.7 48 24 48L69.3 48C96.4 48 119.6 67.4 124.4 94L124.8 96L537.5 96C557.5 96 572.6 114.2 568.9 133.9L537.8 299.8C532.1 330.1 505.7 352 474.9 352L171.3 352L176.4 380.3C178.5 391.7 188.4 400 200 400L456 400C469.3 400 480 410.7 480 424C480 437.3 469.3 448 456 448L200.1 448C165.3 448 135.5 423.1 129.3 388.9L77.2 102.6C76.5 98.8 73.2 96 69.3 96L24 96C10.7 96 0 85.3 0 72zM160 528C160 501.5 181.5 480 208 480C234.5 480 256 501.5 256 528C256 554.5 234.5 576 208 576C181.5 576 160 554.5 160 528zM384 528C384 501.5 405.5 480 432 480C458.5 480 480 501.5 480 528C480 554.5 458.5 576 432 576C405.5 576 384 554.5 384 528zM336 142.4C322.7 142.4 312 153.1 312 166.4L312 200L278.4 200C265.1 200 254.4 210.7 254.4 224C254.4 237.3 265.1 248 278.4 248L312 248L312 281.6C312 294.9 322.7 305.6 336 305.6C349.3 305.6 360 294.9 360 281.6L360 248L393.6 248C406.9 248 417.6 237.3 417.6 224C417.6 210.7 406.9 200 393.6 200L360 200L360 166.4C360 153.1 349.3 142.4 336 142.4z"></path>
    </>
  ),
};
export function Icon({
  name = "arrow",
  className = "inline-block size-5 shrink-0",
  ...props
}: SVGProps<SVGSVGElement> & { name?: keyof typeof icons }) {
  return (
    <svg
      className={className}
      viewBox={
        name === "game" || name === "combo" ? "0 0 640 640" : "0 0 24 24"
      }
      fill={name === "game" || name === "combo" ? "currentColor" : "none"}
      stroke={name === "game" || name === "combo" ? undefined : "currentColor"}
      strokeWidth={
        ["trash", "print", "excel", "check", "card", "ticket"].includes(name)
          ? 1.8
          : 2
      }
      aria-hidden="true"
      {...props}
    >
      {icons[name]}
    </svg>
  );
}
export function HeaderIcon({ name }: { name: string }) {
  const iconName = name in icons ? name as keyof typeof icons : "computer";
  return (
    <Icon name={iconName} className={`ttg-header-icon ttg-icon-${name}`} />
  );
}
