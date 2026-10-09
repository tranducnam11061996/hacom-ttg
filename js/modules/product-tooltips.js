const controllers = new WeakMap();

/** Coordinates match TTG's pointer-based placement; height excludes padding. */
export function calculateTooltipPosition({ x, y, viewportWidth, tooltipWidth, contentHeight, gap = 10 }) {
  return {
    left: x + tooltipWidth > viewportWidth ? x - tooltipWidth - gap : x + gap,
    top: y - contentHeight < 0 ? 0 : y - contentHeight - gap,
  };
}

function createController(doc) {
  const win = doc.defaultView;
  const registered = new WeakSet();
  const layer = doc.createElement('div');
  layer.className = 'listing-tooltip-layer';
  doc.body.append(layer);
  let active = null;
  let frame = null;
  let dismissedAnchor = null;

  function hide() {
    if (frame !== null) win.cancelAnimationFrame(frame);
    frame = null;
    if (active) active.tip.hidden = true;
    active = null;
  }

  function measure() {
    const rect = active.tip.getBoundingClientRect();
    const style = win.getComputedStyle(active.tip);
    active.width = rect.width;
    active.height = rect.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
  }

  function place() {
    frame = null;
    if (!active) return;
    const { left, top } = calculateTooltipPosition({
      ...active.point, viewportWidth: win.innerWidth,
      tooltipWidth: active.width, contentHeight: active.height,
    });
    // Store document coordinates: scrolling alone moves the tooltip with the page.
    active.tip.style.left = `${left + active.scroll.x}px`;
    active.tip.style.top = `${top + active.scroll.y}px`;
  }

  function center(anchor) {
    const rect = anchor.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function show(anchor, tip, point, keyboard = false) {
    if (win.innerWidth < 768 || dismissedAnchor === anchor) return;
    if (active?.anchor !== anchor) {
      hide();
      layer.append(tip);
      tip.hidden = false;
      active = { anchor, tip };
      measure();
    }
    active.point = point;
    active.scroll = { x: win.scrollX, y: win.scrollY };
    active.keyboard = keyboard;
    if (frame === null) frame = win.requestAnimationFrame(place);
  }

  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      dismissedAnchor = active.anchor;
      hide();
    }
  });
  const resize = () => {
    if (!active) return;
    if (win.innerWidth < 768) { hide(); return; }
    measure();
    if (active.keyboard) active.point = center(active.anchor);
    active.scroll = { x: win.scrollX, y: win.scrollY };
    if (frame === null) frame = win.requestAnimationFrame(place);
  };
  win.addEventListener('resize', resize);
  doc.fonts?.addEventListener('loadingdone', resize);

  return root => {
    root.querySelectorAll('[data-product-hover]').forEach(anchor => {
      if (registered.has(anchor)) return;
      const tip = doc.getElementById(anchor.getAttribute('aria-describedby'));
      if (!tip) return;
      registered.add(anchor);
      anchor.addEventListener('mouseenter', event => {
        dismissedAnchor = null;
        show(anchor, tip, { x: event.clientX, y: event.clientY });
      });
      anchor.addEventListener('mousemove', event => {
        show(anchor, tip, { x: event.clientX, y: event.clientY });
      });
      anchor.addEventListener('mouseleave', () => {
        if (active?.anchor === anchor) hide();
        if (dismissedAnchor === anchor) dismissedAnchor = null;
      });
      anchor.addEventListener('focus', () => {
        dismissedAnchor = null;
        show(anchor, tip, center(anchor), true);
      });
      anchor.addEventListener('blur', () => {
        if (active?.anchor === anchor) hide();
        if (dismissedAnchor === anchor) dismissedAnchor = null;
      });
    });
  };
}

export function initProductTooltips(root = document) {
  const doc = root.ownerDocument || root;
  if (!controllers.has(doc)) controllers.set(doc, createController(doc));
  controllers.get(doc)(root);
}
