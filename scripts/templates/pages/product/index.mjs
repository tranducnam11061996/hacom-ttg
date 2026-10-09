import { esc } from '../../../html.mjs';
import { assetUrl } from '../../utils/paths.mjs';
import { floatingContact } from '../../components/floating-contact.mjs';
import { productGallery } from '../../components/product/gallery.mjs';
import { productCombo } from '../../components/product/combo.mjs';
import { productSummary } from '../../components/product/summary.mjs';
import { productInformation } from '../../components/product/information.mjs';
import { similarProducts } from '../../components/similar-products.mjs';
import { serviceBenefits } from '../../components/service-benefits.mjs';
import { commitment } from '../../components/commitment.mjs';
export function productDetailContent({ productData: d, storeData, context = {} }) {
  return '<div class="pd-container"><nav class="pd-breadcrumb" aria-label="Đường dẫn"><a href="' +
    assetUrl('index.html', context) + '">Trang chủ</a><span aria-hidden="true">&gt;</span><a href="' +
    assetUrl('pc/index.html', context) + '">PC GAMING</a><span aria-hidden="true">&gt;</span><span>' +
    esc(d.title) + '</span></nav><div class="pd-top">' +
    productGallery({ ...d, context }) + productSummary({ productData: d, context }) +
    productCombo({ ...d, context }) + '</div>' + productInformation({ ...d, context }) +
    similarProducts({ products: d.similarProducts, assets: d.assets, overlays: d.overlays, context,
      id: 'pd-similar-title', allHref: assetUrl('pc/index.html', context) }) +
    '<div class="pd-support support-block">' + serviceBenefits(storeData.features) + commitment(storeData.questions) +
    '</div></div>' + floatingContact({ contacts:d.contacts, assets:d.assets, context });
}
