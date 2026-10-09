import { esc } from '../../html.mjs';
import { productCard } from './product-card.mjs';
export function similarProducts({ products, assets, overlays = {}, context = {}, id, title = 'SẢN PHẨM TƯƠNG TỰ', allHref }) {
  if (!id) throw Error('similarProducts requires a unique id');
  return '<section class="pd-similar" aria-labelledby="' + esc(id) + '"><div class="pd-section-heading"><h2 id="' +
    esc(id) + '">' + esc(title) + '</h2><a href="' + esc(allHref) + '">Xem tất cả <svg aria-hidden="true" viewBox="0 -960 960 960" fill="currentColor"><path d="M381-480 192-669l51-51 240 240-240 240-51-51 189-189Zm285 0L477-669l51-51 240 240-240 240-51-51 189-189Z"/></svg></a></div>' +
    '<div class="pd-similar-slider"><div class="pd-similar-track">' +
    products.map(p => productCard(p, { assets, overlays, context })).join('') +
    '</div><button type="button" data-demo class="pd-arrow pd-prev" aria-label="Sản phẩm tương tự trước">‹</button>' +
    '<button type="button" data-demo class="pd-arrow pd-next" aria-label="Sản phẩm tương tự tiếp theo">›</button></div></section>';
}
