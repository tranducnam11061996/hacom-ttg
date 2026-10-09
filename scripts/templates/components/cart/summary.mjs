import { esc } from '../../../html.mjs';
import { formatMoney as cartMoney } from '../../utils/money.mjs';
import { cartIcon } from './icons.mjs';
import { cartActions } from './actions.mjs';
export function cartSummary({ total, installmentMonthly, labels }) {
  return `<section class="cart-summary" aria-labelledby="cart-summary-title"><h2 id="cart-summary-title" class="cart-column-title">${esc(labels.summary)}</h2><div class="cart-voucher"><div class="cart-voucher-inner"><label class="sr-only" for="cart-voucher">Mã Voucher</label><input id="cart-voucher" placeholder="Mã Voucher" autocomplete="off"><button type="button" data-demo>${cartIcon('ticket')} Chọn mã voucher</button></div></div><div class="cart-summary-line"><span>Tổng cộng</span><span>${cartMoney(total)} VNĐ</span></div><div class="cart-summary-line"><span>Giảm giá Voucher</span><span>0 VNĐ</span></div><div class="cart-final-line"><b>Thành tiền</b><div><b class="cart-final-price">${cartMoney(total)} VNĐ</b><span>(Giá đã bao gồm VAT)</span></div></div>${cartActions({installmentMonthly})}</section>`;
}
