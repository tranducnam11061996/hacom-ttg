import { esc } from '../../../html.mjs';
import { createImage } from '../../utils/assets.mjs';
import { productHref } from '../../utils/paths.mjs';
import { cartIcon } from './icons.mjs';
import { formatMoney } from '../../utils/money.mjs';
export const cartMoney = formatMoney;
export function cartItemRow(item, { assets, context = {} }) {
  const image = createImage(assets, context);
  return `<tr class="cart-item" data-cart-item="${esc(item.id)}"><td class="cart-product"><div class="cart-product-inner">${image(item.image,item.name,'cart-product-image',true)}<div><a href="${esc(productHref(item,context))}" class="cart-product-name"><b>${esc(item.name)}</b></a><p><b>Bảo hành:</b> <span class="cart-warranty">${esc(item.warranty)}</span></p></div></div></td><td class="cart-unit-price"><span class="cart-cell-label">Đơn giá</span>${cartMoney(item.price)} VNĐ</td><td class="cart-quantity-cell"><span class="cart-cell-label">Số lượng</span><div class="cart-quantity"><button type="button" data-demo aria-label="Giảm số lượng ${esc(item.name)}">-</button><input type="text" value="${item.quantity}" readonly aria-label="Số lượng ${esc(item.name)}"><button type="button" data-demo aria-label="Tăng số lượng ${esc(item.name)}">+</button></div></td><td class="cart-item-total"><span class="cart-cell-label">Thành tiền</span><b>${cartMoney(item.price*item.quantity)} VNĐ</b></td><td class="cart-delete-cell"><button type="button" data-demo aria-label="Xóa sản phẩm ${esc(item.name)}">${cartIcon('trash')}</button></td></tr>`;
}
export function cartItems({ items, assets, total, context = {} }) {
  return `<table class="cart-items" aria-label="Sản phẩm trong giỏ hàng"><tbody>${items.map(item=>cartItemRow(item,{assets,context})).join('')}<tr class="cart-total-row"><td colspan="5"><div><b>Tổng tiền:</b> <b class="cart-total-price">${cartMoney(total)} VNĐ</b></div></td></tr></tbody></table>`;
}
