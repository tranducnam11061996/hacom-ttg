import { carousels } from './ui.js';
import { initHero } from './modules/hero.js';
import { initSaleTabs } from './modules/sale-tabs.js';

initHero();
initSaleTabs(document, carousels);
