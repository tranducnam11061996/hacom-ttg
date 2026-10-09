import { load } from 'cheerio';
import { createImage } from '../../utils/assets.mjs';

export function productFragment(html, { assets, context = {} }) {
  const $ = load(html || '', null, false);
  const image = createImage(assets, context);
  $('img').each((_, e) => {
    const n = $(e), original = { ...e.attribs };
    const replacement = load(image(original.src, original.alt || '', original.class || ''), null, false)('img');
    // Content-editor sizing is part of the source document's layout.
    if (original.style) replacement.attr('style', original.style);
    for (const key of ['width', 'height']) if (original[key]) replacement.attr(key, original[key]);
    n.replaceWith(replacement);
  });
  return $.html();
}
