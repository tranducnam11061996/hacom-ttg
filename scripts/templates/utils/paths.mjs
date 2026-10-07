/** Resolve root-relative public assets for a generated page on static hosting. */
export function assetUrl(value, { depth = 0 } = {}) {
  if (!Number.isInteger(depth) || depth < 0) throw new Error('Invalid page depth');
  const url = String(value ?? '');
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(url)) return url;
  return '../'.repeat(depth) + url.replace(/^(?:\.\/|\/)+/, '');
}
