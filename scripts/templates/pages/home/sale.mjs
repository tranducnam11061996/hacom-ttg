import { icon } from "../../../html.mjs";
import { createImage } from "../../utils/assets.mjs";
import { productCard } from "../../components/product-card.mjs";
const labels = [
  "Hot sale",
  "PC doanh nghiệp kèm màn",
  "PC doanh nghiệp",
  "PC Intel Gaming",
  "PC AMD Gaming",
  "PC đồ họa — làm việc",
];
export function saleSection(collections, options) {
  const image = createImage(options.assets, options.context);
  return `<section data-sale class="sale-section" aria-labelledby="sale-title"><h2 id="sale-title"><span class="sr-only">Deal HOT mỗi ngày - Khuyến mãi liền tay</span>${image('./include/ttgshop-collection-title-1.png','','sale-title')}</h2><div id="sale-groups" role="tablist" aria-label="Nhóm khuyến mãi" class="sale-groups" hidden>${collections.map((c,i)=>`<button id="tab-${c.id}" type="button" role="tab" aria-controls="collection-${c.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${labels[i]}</button>`).join('')}</div>${collections.map((c,i)=>`<div id="collection-${c.id}" role="tabpanel" aria-labelledby="tab-${c.id}" ${i?'hidden':''}><div data-category-carousel data-sale-carousel class="category-carousel sale-carousel" role="region" aria-roledescription="carousel" aria-label="Sản phẩm ${labels[i]}"><div data-category-track id="sale-track-${c.id}" class="category-track">${c.products.map(p => productCard(p, options)).join('')}</div><button type="button" data-category-prev aria-controls="sale-track-${c.id}" aria-label="Sản phẩm trước — ${labels[i]}" class="category-arrow category-prev" hidden><span class="inline-block rotate-180">${icon()}</span></button><button type="button" data-category-next aria-controls="sale-track-${c.id}" aria-label="Sản phẩm tiếp theo — ${labels[i]}" class="category-arrow category-next" hidden>${icon()}</button></div></div>`).join('')}<div class="sale-footer"><a href="#" class="sale-all">Xem tất cả <svg viewBox="0 -960 960 960" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z"/></svg></a><button type="button" data-sale-toggle aria-controls="sale-groups" aria-expanded="false" aria-label="Chọn nhóm: Hot sale" class="sale-toggle">Chọn nhóm</button></div></section>`;
}
