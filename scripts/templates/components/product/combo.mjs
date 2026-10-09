import { esc, icon } from '../../../html.mjs';
import { createImage } from '../../utils/assets.mjs';
export function productCombo({ comboGroups, assets, price, comboCartSvg, context = {} }) {
  const image = createImage(assets, context);
  return '<section class="pd-combo" aria-label="Sản phẩm mua kèm"><h2>Sản phẩm mua kèm</h2><div class="pd-combo-slider"><div class="pd-combo-track">' +
    comboGroups.map(g => '<article class="pd-combo-card"><div class="pd-combo-image">' +
      image(g.image, g.title) + '<h3>' + esc(g.title) + '</h3></div><button type="button" data-demo>Chọn sản phẩm</button></article>').join('') +
    '</div><button type="button" data-demo class="pd-arrow pd-prev" aria-label="Nhóm mua kèm trước">‹</button><button type="button" data-demo class="pd-arrow pd-next" aria-label="Nhóm mua kèm tiếp theo">›</button></div>' +
    '<div class="pd-combo-summary"><div><p>Tạm tính: <strong>' + esc(price.replace(/\s*đ$/, 'đ')) +
    '</strong></p><p>Tiết kiệm: <b>0đ</b></p></div><button type="button" data-demo class="pd-combo-buy">' + (comboCartSvg || icon('cart')) + ' Mua combo</button></div></section>';
}
