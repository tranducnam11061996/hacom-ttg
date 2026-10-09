import { esc } from '../../../html.mjs';
import { assetUrl } from '../../utils/paths.mjs';
import { cartItems } from '../../components/cart/items.mjs';
import { buyerInformation } from '../../components/cart/buyer-information.mjs';
import { cartSummary } from '../../components/cart/summary.mjs';
import { serviceBenefits } from '../../components/service-benefits.mjs';
import { commitment } from '../../components/commitment.mjs';
import { floatingContact } from '../../components/floating-contact.mjs';
export function cartContent({ cartData:d, storeData, contactData, context = {} }) {
  const total = d.items.reduce((n,item)=>n+item.price*item.quantity,0);
  return `<div class="cart-container"><nav class="cart-breadcrumb" aria-label="Đường dẫn"><a href="${assetUrl('index.html',context)}">Trang chủ</a><span aria-hidden="true">&gt;</span><span>${esc(d.labels.breadcrumb)}</span></nav><div class="cart-heading"><h1>${esc(d.labels.title)}</h1><button type="button" data-demo>${esc(d.labels.clear)}</button></div><form data-demo-form novalidate autocomplete="off">${cartItems({...d,total,context})}<div class="cart-customer">${buyerInformation(d)}${cartSummary({...d,total})}</div></form><div class="cart-support support-block">${serviceBenefits(storeData.features)}${commitment(storeData.questions)}</div></div>${floatingContact({...contactData,context})}`;
}
