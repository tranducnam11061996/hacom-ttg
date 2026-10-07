import { load } from 'cheerio';
import { esc } from '../../html.mjs';
import { assetUrl } from './paths.mjs';
export { assetUrl } from './paths.mjs';

export function createImage(assets, context = {}) {
  return (source, alt, className = '', eager = false) => {
    const asset = assets[source];
    if (!asset) throw new Error('Asset missing: ' + source);
    const src = esc(assetUrl(asset.path, context));
    const srcset = asset.small
      ? `srcset="${esc(assetUrl(asset.small, context))} 800w, ${src} ${asset.width}w" sizes="(max-width: 800px) 100vw, 1220px"`
      : '';
    return `<img src="${src}" ${srcset} width="${asset.width}" height="${asset.height}" alt="${esc(alt)}" class="${esc(className)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  };
}

// Snapshot HTML is intentionally reduced to demo markup, preserving its text.
export function clean(html) {
  const $ = load(html ?? '', null, false);
  $('script,style,i,svg').remove();
  $('*').each((_, element) => {
    const node = $(element);
    for (const attribute of Object.keys(element.attribs || {})) node.removeAttr(attribute);
    if (element.name === 'a') node.attr('href', '#');
  });
  return $.html();
}
