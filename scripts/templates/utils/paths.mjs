/** Resolve root-relative public assets for a generated page on static hosting. */
export const productDetailSlug = 'pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc';
export function productHref(product, context = {}) {
  return product.sourceUrl === '/' + productDetailSlug ||
    product.name.trim() === 'PC TTG GAMING CORE ULTRA 7 270K PLUS - RTX 5070 12GB OC'
    ? assetUrl(productDetailSlug + '/index.html', context) : '#';
}
export function categoryHref(name, context = {}) {
  return /^PC GAMING$/i.test(name.trim()) ? assetUrl('pc/index.html', context) : '#';
}
export function assetUrl(value, { depth = 0 } = {}) {
  if (!Number.isInteger(depth) || depth < 0) throw new Error('Invalid page depth');
  const url = String(value ?? '');
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(url)) return url;
  return '../'.repeat(depth) + url.replace(/^(?:\.\/|\/)+/, '');
}
