import { productFragment } from './fragment.mjs';
export function productInformation({ fragments, assets, context = {} }) {
  const panel = (kind, title, html) => '<section class="pd-information-panel pd-' + kind + '"><h2>' + title +
    '</h2><div class="pd-content">' + productFragment(html, { assets, context }) +
    '</div><div class="pd-more"><button type="button" data-demo>Xem thêm <span aria-hidden="true">⌄</span></button></div></section>';
  return '<div class="pd-information">' + panel('description', 'MÔ TẢ SẢN PHẨM', fragments.description) +
    panel('specification', 'THÔNG SỐ KỸ THUẬT', fragments.specification) + '</div>';
}
