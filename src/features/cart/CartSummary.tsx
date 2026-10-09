import { cartData } from "@/data";
import { DemoButton } from "@/components/ui/Demo";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/format";
export function CartSummary({ total }: { total: number }) {
  return (
    <section className="cart-summary" aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title" className="cart-column-title">
        {cartData.labels.summary}
      </h2>
      <div className="cart-voucher">
        <div className="cart-voucher-inner">
          <label className="sr-only" htmlFor="cart-voucher">
            Mã Voucher
          </label>
          <input
            id="cart-voucher"
            placeholder="Mã Voucher"
            autoComplete="off"
          />
          <DemoButton>
            <Icon name="ticket" className="cart-icon" /> Chọn mã voucher
          </DemoButton>
        </div>
      </div>
      <div className="cart-summary-line">
        <span>Tổng cộng</span>
        <span>{formatMoney(total)} VNĐ</span>
      </div>
      <div className="cart-summary-line">
        <span>Giảm giá Voucher</span>
        <span>0 VNĐ</span>
      </div>
      <div className="cart-final-line">
        <b>Thành tiền</b>
        <div>
          <b className="cart-final-price">{formatMoney(total)} VNĐ</b>
          <span>(Giá đã bao gồm VAT)</span>
        </div>
      </div>
      <div className="cart-actions">
        <label className="cart-terms">
          <input type="checkbox" />{" "}
          <b>
            Tôi đã đọc và đồng ý với các Điều kiện giao dịch chung của website
          </b>
        </label>
        <div className="cart-action-grid">
          <DemoButton className="cart-export">
            <Icon name="print" className="cart-icon" /> In báo giá
          </DemoButton>
          <DemoButton className="cart-export">
            <Icon name="excel" className="cart-icon" /> Tải file excel
          </DemoButton>
          <button type="submit" className="cart-order">
            <Icon name="check" className="cart-icon" /> ĐẶT HÀNG
          </button>
          <DemoButton className="cart-installment">
            <Icon name="card" className="cart-icon" /> TRẢ GÓP QUA HỒ SƠ
            <small>
              Chỉ từ {formatMoney(cartData.installmentMonthly)} đ/tháng
            </small>
          </DemoButton>
        </div>
        <div className="cart-payment-grid">
          <DemoButton className="cart-pay-card">
            <strong>Trả góp qua thẻ</strong>
            <span>Visa, Master, JCB</span>
          </DemoButton>
          <DemoButton className="cart-pay-later">
            <strong>Mua Ngay - Trả Sau</strong>
          </DemoButton>
        </div>
      </div>
    </section>
  );
}
