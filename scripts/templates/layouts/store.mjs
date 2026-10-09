import { esc, shell } from '../../html.mjs';
import { createImage } from '../utils/assets.mjs';
import { header } from '../components/header.mjs';
import { footer } from '../components/footer.mjs';

/** Components receive snapshots here; no template reads files or writes output. */
export function storeLayout({
  title, description, content, headerData, storeData,
  cartCount, context = {}, mainClass = 'site-container py-6', pageScript = 'ui',
}) {
  const image = createImage(storeData.assets, context);
  const logo = image('./include/logo_ttgshop-logo-27122025-1.png', 'TTG SHOP', '', true)
    .replace('fetchpriority="high"', '');
  const body = `${header({ headerData, searchCategories: storeData.searchCategories, logo, cartCount, context })}<main id="main" class="${esc(mainClass)}">${content}</main>${footer({ footerHtml: storeData.footer, assets: storeData.assets, context })}<p class="fixed bottom-3 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-lg bg-secondary px-4 py-3 text-sm text-white" role="status" id="demo-status" hidden></p>`;
  return shell(title, body, { description, depth: context.depth ?? 0, script: pageScript });
}
