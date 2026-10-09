import { createImage } from '../utils/assets.mjs';
export function floatingContact({ contacts, assets, context = {} }) {
  const image = createImage(assets, context);
  return `<aside class="floating-contact pd-contact" aria-label="Liên hệ TTG SHOP"><button type="button" data-demo aria-label="Messenger">${image(contacts.messenger,'Messenger')}</button><button type="button" data-demo aria-label="Zalo">${image(contacts.zalo,'Zalo')}</button></aside>`;
}
