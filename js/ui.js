import { initDemo } from './modules/demo.js';
import { initHeader } from './modules/header.js';
import { initCarousels } from './modules/carousel.js';
import { initCommitment } from './modules/commitment.js';

export function initStore(document = globalThis.document) {
  initDemo(document);
  initHeader(document);
  const carousels = initCarousels(document);
  initCommitment(document);
  return carousels;
}

export const carousels = typeof document === 'undefined' ? new Map() : initStore();
