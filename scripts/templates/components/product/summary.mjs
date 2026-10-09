import { esc } from '../../../html.mjs';
import { productFragment } from './fragment.mjs';
export function productSummary({ productData: d, context = {} }) {
  const fragment = name => productFragment(d.fragments[name], { assets: d.assets, context });
  return '<section class="pd-summary-column"><h1 class="pd-title">' + esc(d.displayTitle) + '</h1>' +
    '<div class="pd-price-box">' + fragment('price') + '</div><div class="pd-summary">' + fragment('summary') + '</div>' +
    '<section class="pd-upgrade"><h2><span class="pd-icon pd-icon-config" aria-hidden="true"></span> UPGRADE</h2><table><tbody>' +
    d.upgradeGroups.map(g => '<tr><th scope="row">' + esc(g.label) + '</th><td>' + g.options.map((o, i) =>
      '<button type="button" data-demo class="pd-upgrade-choice' + (i === g.selectedIndex ? ' pd-selected' : '') +
      '" aria-pressed="' + (i === g.selectedIndex) + '">' + esc(o) + '</button>').join('') + '</td></tr>').join('') +
    '</tbody></table></section><section class="pd-offer">' + fragment('promotion') + '</section>' +
    '<div class="pd-quantity">' + fragment('quantity') + '</div><div class="pd-purchase">' + fragment('purchase') + '</div>' +
    '<div class="pd-payment"><button type="button" data-demo class="pd-payment-card"><strong>TRẢ GÓP QUA THẺ</strong><span>Visa, Master, JCB</span></button>' +
    '<button type="button" data-demo class="pd-payment-later"><strong>MUA NGAY - TRẢ SAU</strong></button></div></section>';
}
