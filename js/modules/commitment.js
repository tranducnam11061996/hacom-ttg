const initialized = new WeakSet();
export function initCommitment(document = globalThis.document) {
  document.querySelectorAll('[data-commitment]').forEach((item) => {
    if (initialized.has(item)) return;
    initialized.add(item);
    const button = item.querySelector('[data-commitment-toggle]');
    const panel = item.querySelector('[data-commitment-panel]');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, running = false, open = false;
    function finish() {
      cancelAnimationFrame(frame);
      running = false;
      panel.hidden = !open;
      panel.inert = !open;
      panel.style.removeProperty('height');
      panel.style.removeProperty('overflow');
    }
    function animate() {
      cancelAnimationFrame(frame);
      const from = panel.hidden ? 0 : panel.getBoundingClientRect().height;
      panel.hidden = false;
      panel.inert = !open;
      panel.style.overflow = 'hidden';
      panel.style.height = from + 'px';
      const to = open ? panel.firstElementChild.getBoundingClientRect().height : 0;
      if (motion.matches) { finish(); return; }
      running = true;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / 400);
        panel.style.height = (from + (to - from) * (1 - Math.cos(Math.PI * t)) / 2) + 'px';
        if (t < 1) frame = requestAnimationFrame(step);
        else finish();
      }
      frame = requestAnimationFrame(step);
    }
    button.addEventListener('click', () => {
      open = !open;
      button.setAttribute('aria-expanded', String(open));
      if (!open && panel.contains(document.activeElement)) button.focus();
      animate();
    });
    window.addEventListener('resize', () => { if (running) animate(); });
    motion.addEventListener('change', () => { if (running) finish(); });
  });
}
