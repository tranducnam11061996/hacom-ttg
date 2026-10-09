const paths = {
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 10v8M14 10v8"/>',
  print:'<path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 14h10v7H7z"/><path d="M17 11h1"/>',
  excel:'<path d="M7 2h9l4 4v16H7zM16 2v5h4M3 9h10v10H3zM5 11l6 6M11 11l-6 6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  card:'<rect x="2" y="4" width="20" height="16" rx="1"/><path d="M2 9h20M5 15h5"/>',
  ticket:'<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM8 6v12"/>',
};
export function cartIcon(name) { return `<svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${paths[name] || ''}</svg>`; }
