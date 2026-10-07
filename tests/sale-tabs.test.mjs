import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRuntime } from './helpers/runtime.mjs';

test('Sale tabs preserve picker, keyboard, focus and carousel lifecycle; initialize once', async () => {
  class Target {
    handlers = new Map(); attributes = {};
    addEventListener(name, handler) { const list = this.handlers.get(name) || []; list.push(handler); this.handlers.set(name, list); }
    emit(name, event = {}) { for (const fn of this.handlers.get(name) || []) fn({ preventDefault() {}, ...event }); }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name]; }
    focus() { focused = this; }
  }
  let focused;
  const list = new Target(), toggle = new Target(), sale = new Target();
  const calls = [[], []], rails = [{}, {}];
  const panels = rails.map((rail, i) => ({ hidden: i !== 0, querySelector: () => rail }));
  const tabs = panels.map((_, i) => {
    const tab = new Target(); tab.textContent = `Nhóm ${i}`;
    tab.setAttribute('aria-controls', `panel-${i}`); tab.setAttribute('aria-selected', i === 0);
    return tab;
  });
  list.hidden = true; list.querySelectorAll = () => tabs; list.closest = () => sale;
  sale.querySelector = () => toggle;
  const document = { querySelectorAll: () => [list], getElementById: id => panels[Number(id.split('-')[1])] };
  const controllers = new Map(rails.map((rail, i) => [rail, { reset() { calls[i].push('reset'); }, stop() { calls[i].push('stop'); } }]));
  const { initSaleTabs } = await loadRuntime('sale-tabs', { document });
  initSaleTabs(document, controllers); initSaleTabs(document, controllers);
  assert.equal(toggle.handlers.get('click').length, 1);
  toggle.emit('click'); assert.equal(list.hidden, false); assert.equal(focused, tabs[0]);
  tabs[0].emit('keydown', { key: 'ArrowRight' });
  assert.equal(focused, tabs[1]); assert.equal(panels[0].hidden, true); assert.equal(panels[1].hidden, false);
  assert.deepEqual(calls, [['stop'], ['reset']]);
  tabs[1].emit('click'); assert.equal(list.hidden, true); assert.equal(focused, toggle);
  assert.equal(toggle.getAttribute('aria-label'), 'Chọn nhóm: Nhóm 1');
  toggle.emit('click'); sale.emit('keydown', { key: 'Escape' }); assert.equal(list.hidden, true); assert.equal(focused, toggle);
  tabs[1].emit('keydown', { key: 'Home' }); assert.equal(focused, tabs[0]); assert.equal(tabs[0].tabIndex, 0);
  tabs[0].emit('keydown', { key: 'End' }); assert.equal(focused, tabs[1]); assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
});
