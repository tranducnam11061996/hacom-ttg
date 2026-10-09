import { esc } from '../../../html.mjs';
import { createImage } from '../../utils/assets.mjs';
export function productGallery({ gallery, title, assets, overlays, context = {} }) {
  const image = createImage(assets, context);
  return '<section class="pd-gallery" aria-label="Hình ảnh sản phẩm"><div class="pd-gallery-main">' +
    '<button type="button" data-demo class="pd-gallery-picture" aria-label="' + esc('Phóng to ảnh — ' + title) + '">' +
    image(gallery[0].image, title, '', true) + '</button>' +
    image(overlays.delta, '', 'pd-gallery-overlay', true).replace('fetchpriority="high"', '') +
    '<button type="button" data-demo class="pd-arrow pd-prev" aria-label="Ảnh trước">‹</button>' +
    '<button type="button" data-demo class="pd-arrow pd-next" aria-label="Ảnh tiếp theo">›</button></div>' +
    '<div class="pd-thumbnails">' + gallery.map((g, i) =>
      '<button type="button" data-demo class="pd-thumbnail' + (i === 0 ? ' pd-selected' : '') + '" aria-label="Ảnh ' + (i + 1) + ' — ' + esc(title) + '">' +
      '<span>' + image(g.thumbnail, title).replace(/width="\d+" height="\d+"/, 'width="100" height="100"') + '</span></button>').join('') + '</div></section>';
}
