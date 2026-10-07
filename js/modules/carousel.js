import { carouselEase } from "./motion.js";
const initialized = new WeakSet();
const controllers = new WeakMap();
export function initCarousels(document = globalThis.document) {
  const allRails = [...document.querySelectorAll("[data-category-carousel]")];
  const categoryControllers = new Map(allRails.filter(rail => controllers.has(rail)).map(rail => [rail, controllers.get(rail)]));
  const rails = allRails.filter(rail => !initialized.has(rail));
  if (!rails.length) return categoryControllers;
  const categoryMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const categoryVisibility = new IntersectionObserver((entries) => {
    for (const entry of entries) categoryControllers.get(entry.target)?.visible(entry.isIntersecting);
  }, { threshold: 0.01 });
  rails.forEach((rail) => {
    if (initialized.has(rail)) return;
    initialized.add(rail);
    const track = rail.querySelector("[data-category-track]");
    const buttons = [...rail.querySelectorAll("[data-category-prev], [data-category-next]")];
    let step = 0, maxIndex = 0, maxScroll = 0, inView = false;
    let timer = 0, frame = 0, settleTimer = 0, interacting = false;
    let programmaticUntil = 0;
    let hovered = false, focused = false, dragging = false;
    const salePanel = rail.closest?.('[role="tabpanel"]');
    const enabled = () => !salePanel?.hidden;
    const current = () => step ? Math.min(maxIndex, Math.round(track.scrollLeft / step)) : 0;
    function stop() { clearTimeout(timer); timer = 0; }
    function schedule() {
      stop();
      if (enabled() && inView && maxIndex && !document.hidden && !categoryMotion.matches && !hovered && !focused && !interacting && !frame)
        timer = setTimeout(() => move(1), 3500);
    }
    function cancel() {
      cancelAnimationFrame(frame);
      frame = 0;
      track.style.removeProperty("scroll-snap-type");
      stop();
    }
    function move(delta, absolute) {
      const index = current();
      cancel();
      const next = absolute ?? (index + delta > maxIndex ? 0 : index + delta < 0 ? maxIndex : index + delta);
      const target = Math.min(next * step, maxScroll);
      const start = track.scrollLeft;
      if (categoryMotion.matches || Math.abs(target - start) < 1) {
        programmaticUntil = performance.now() + 60;
        track.scrollLeft = target;
        schedule();
        return;
      }
      track.style.scrollSnapType = "none";
      const started = performance.now();
      function animate(now) {
        const progress = Math.min(1, (now - started) / 1000);
        track.scrollLeft = start + (target - start) * carouselEase(progress);
        if (progress < 1) frame = requestAnimationFrame(animate);
        else {
          frame = 0;
          programmaticUntil = performance.now() + 60;
          track.scrollLeft = target;
          track.style.removeProperty("scroll-snap-type");
          schedule();
        }
      }
      frame = requestAnimationFrame(animate);
    }
    function measure() {
      if (!enabled()) { cancel(); return; }
      const index = current();
      cancel();
      step = (track.firstElementChild?.getBoundingClientRect().width ?? 0) + 10;
      const slots = Math.round((track.clientWidth + 10) / step);
      maxIndex = Math.max(0, track.children.length - slots);
      maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      buttons.forEach(button => { button.hidden = maxIndex === 0; });
      programmaticUntil = performance.now() + 60;
      track.scrollLeft = Math.min(index, maxIndex) * step;
      schedule();
    }
    function userInteraction() {
      cancel();
      interacting = true;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (dragging) return;
        interacting = false;
        schedule();
      }, 200);
    }
    buttons.forEach(button => button.addEventListener("click", () => move(button.hasAttribute("data-category-prev") ? -1 : 1)));
    rail.addEventListener("pointerenter", event => { if (event.pointerType !== "touch") { hovered = true; stop(); } });
    rail.addEventListener("pointerleave", () => { hovered = false; schedule(); });
    rail.addEventListener("focusin", () => { focused = true; cancel(); });
    rail.addEventListener("focusout", event => { focused = rail.contains(event.relatedTarget); schedule(); });
    track.addEventListener("pointerdown", () => { dragging = true; userInteraction(); }, { passive:true });
    const release = () => { if (dragging) { dragging = false; userInteraction(); } };
    window.addEventListener("pointerup", release, { passive:true });
    window.addEventListener("pointercancel", release, { passive:true });
    track.addEventListener("wheel", userInteraction, { passive:true });
    track.addEventListener("scroll", () => { if (!frame && performance.now() > programmaticUntil) userInteraction(); }, { passive:true });
    rail.addEventListener("keydown", event => {
      const delta = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      if (delta || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        move(delta, event.key === "Home" ? 0 : event.key === "End" ? maxIndex : undefined);
      }
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancel(); else schedule(); });
    categoryMotion.addEventListener("change", () => { cancel(); schedule(); });
    if (rail.hasAttribute?.('data-sale-carousel')) {
      let drag = null, suppressClick = false;
      track.addEventListener('dragstart', e => e.preventDefault());
      track.addEventListener('pointerdown', e => {
        if(e.pointerType!=='mouse'||e.button!==0)return;
        drag={id:e.pointerId,x:e.clientX,left:track.scrollLeft,moved:false};
      });
      track.addEventListener('pointermove', e => {
        if(!drag||drag.id!==e.pointerId)return;
        const dx=e.clientX-drag.x;
        if(!drag.moved&&Math.abs(dx)>6){drag.moved=true;track.setPointerCapture(e.pointerId);track.style.scrollSnapType='none';rail.classList.add('is-dragging');}
        if(drag.moved){e.preventDefault();track.scrollLeft=drag.left-dx;}
      });
      const endDrag=()=>{
        if(!drag)return;const moved=drag.moved;drag=null;rail.classList.remove('is-dragging');
        if(moved){suppressClick=true;setTimeout(()=>{suppressClick=false;},0);move(0);}
      };
      window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag);
      rail.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();}},true);
    }
    categoryControllers.set(rail, { reset() { cancel(); interacting=false;dragging=false;clearTimeout(settleTimer);track.scrollLeft=0;measure(); }, stop:cancel, visible(value) { inView = value; if (!value) cancel(); else schedule(); } });
    controllers.set(rail, categoryControllers.get(rail));
    new ResizeObserver(measure).observe(track);
    categoryVisibility.observe(rail);
    measure();
  });

  return categoryControllers;
}
