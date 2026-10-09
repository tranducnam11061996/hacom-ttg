import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTooltipPosition, initProductTooltips } from '../js/modules/product-tooltips.js';

test('Tooltip flips at the measured viewport threshold, not at a column number', () => {
  const base = { y: 300, viewportWidth: 1620, tooltipWidth: 420, contentHeight: 698 };
  assert.deepEqual(calculateTooltipPosition({ ...base, x: 1199 }), { left: 1209, top: 0 });
  assert.deepEqual(calculateTooltipPosition({ ...base, x: 1200 }), { left: 1210, top: 0 });
  assert.deepEqual(calculateTooltipPosition({ ...base, x: 1201 }), { left: 771, top: 0 });
  assert.equal(calculateTooltipPosition({ ...base, viewportWidth: 1920, x: 1359.2 }).left, 1369.2);
});

test('Tooltip uses content height and keeps the source top-edge behavior', () => {
  const base = { x: 512, viewportWidth: 1440, tooltipWidth: 377, contentHeight: 607 };
  assert.deepEqual(calculateTooltipPosition({ ...base, y: 685 }), { left: 522, top: 68 });
  assert.equal(calculateTooltipPosition({ ...base, y: 300 }).top, 0);
  assert.equal(calculateTooltipPosition({ ...base, y: 607 }).top, -10);
});

test('Tooltip width changes can change side without changing the product', () => {
  const base = { x: 1040, y: 700, viewportWidth: 1440, contentHeight: 452 };
  assert.equal(calculateTooltipPosition({ ...base, tooltipWidth: 377 }).left, 1050);
  assert.equal(calculateTooltipPosition({ ...base, tooltipWidth: 420 }).left, 610);
});

function harness() {
  class Target {
    listeners = new Map();
    addEventListener(name, fn) {
      const handlers = this.listeners.get(name) || [];
      handlers.push(fn);
      this.listeners.set(name, handlers);
    }
    emit(name, event = {}) { this.listeners.get(name)?.forEach(fn => fn(event)); }
  }
  const doc = new Target(), win = new Target(), root = {}, frames = new Map();
  let sequence = 0;
  Object.assign(win, {
    innerWidth: 1620, scrollX: 0, scrollY: 400,
    requestAnimationFrame(fn) { const id = ++sequence; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    getComputedStyle() { return { paddingTop: '0', paddingBottom: '10', borderTopWidth: '0', borderBottomWidth: '0' }; },
  });
  const layer = { append(tip) { tip.parent = this; } };
  Object.assign(doc, { defaultView: win, body: { append() {} }, createElement: () => layer });
  const tips = [0, 1].map(() => ({ hidden: true, style: {}, getBoundingClientRect: () => ({ width: win.innerWidth >= 1620 ? 420 : 377, height: 708 }) }));
  const anchors = tips.map((_, i) => {
    const anchor = new Target();
    anchor.getAttribute = () => `tip-${i}`;
    anchor.getBoundingClientRect = () => ({ left: 568, top: 208, width: 229, height: 229 });
    return anchor;
  });
  doc.getElementById = id => tips[Number(id.slice(4))];
  Object.assign(root, { ownerDocument: doc, querySelectorAll: () => anchors });
  const flush = () => { for (const [id, fn] of [...frames]) { frames.delete(id); fn(); } };
  initProductTooltips(root);
  return { root, doc, win, tips, anchors, frames, flush, layer };
}

test('Leaving or switching products cancels queued movement and keeps only one tooltip open', () => {
  const h = harness(), [first, second] = h.anchors;
  initProductTooltips(h.root);
  assert.equal(first.listeners.get('mousemove').length, 1);
  first.emit('mousemove', { clientX: 682, clientY: 323 });
  first.emit('mousemove', { clientX: 1201, clientY: 323 });
  assert.equal(h.frames.size, 1);
  h.flush();
  assert.equal(h.tips[0].style.left, '771px');
  assert.equal(h.tips[0].style.top, '400px');
  assert.equal(h.tips[0].parent, h.layer);
  first.emit('mousemove', { clientX: 700, clientY: 323 });
  first.emit('mouseleave');
  h.flush();
  assert.equal(h.tips[0].hidden, true);
  assert.equal(h.frames.size, 0);
  first.emit('mouseenter', { clientX: 682, clientY: 323 });
  second.emit('mouseenter', { clientX: 1201, clientY: 323 });
  h.flush();
  assert.equal(h.tips[0].hidden, true);
  assert.equal(h.tips[1].hidden, false);
});

test('Escape suppresses movement until re-entry; keyboard focus and blur remain usable', () => {
  const h = harness(), anchor = h.anchors[0];
  anchor.emit('focus'); h.flush();
  assert.equal(h.tips[0].hidden, false);
  h.doc.emit('keydown', { key: 'Escape' });
  anchor.emit('mousemove', { clientX: 682, clientY: 323 }); h.flush();
  assert.equal(h.tips[0].hidden, true);
  anchor.emit('mouseleave');
  anchor.emit('mouseenter', { clientX: 682, clientY: 323 }); h.flush();
  assert.equal(h.tips[0].hidden, false);
  anchor.emit('blur');
  assert.equal(h.tips[0].hidden, true);
});

test('Scrolling retains document placement; resize remeasures width and mobile closes', () => {
  const h = harness(), anchor = h.anchors[0];
  anchor.emit('mousemove', { clientX: 1040, clientY: 323 }); h.flush();
  const top = h.tips[0].style.top;
  h.win.scrollY += 80; h.win.emit('scroll');
  assert.equal(h.tips[0].hidden, false);
  assert.equal(h.tips[0].style.top, top);
  h.win.innerWidth = 1440; h.win.emit('resize'); h.flush();
  assert.equal(h.tips[0].style.left, '1050px');
  h.win.innerWidth = 390; h.win.emit('resize'); h.flush();
  anchor.emit('focus'); h.flush();
  assert.equal(h.tips[0].hidden, true);
});
