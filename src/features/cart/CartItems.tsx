import Link from "next/link";
import { cartData } from "@/data";
import { AssetImage } from "@/components/ui/AssetImage";
import { DemoButton } from "@/components/ui/Demo";
import { routes } from "@/lib/routes";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/format";
export function CartItems({ total }: { total: number }) {
  return (
    <table className="cart-items" aria-label="Sản phẩm trong giỏ hàng">
      <tbody>
        {cartData.items.map((item) => (
          <tr className="cart-item" data-cart-item={item.id} key={item.id}>
            <td className="cart-product">
              <div className="cart-product-inner">
                <Link
                  className="contents"
                  prefetch={false}
                  href={routes.product}
                >
                  <AssetImage
                    image={item.image}
                    alt={item.name}
                    className="cart-product-image"
                    eager
                  />
                </Link>
                <div>
                  <Link
                    prefetch={false}
                    href={routes.product}
                    className="cart-product-name"
                  >
                    <b>{item.name}</b>
                  </Link>
                  <p>
                    <b>Bảo hành:</b>{" "}
                    <span className="cart-warranty">{item.warranty}</span>
                  </p>
                </div>
              </div>
            </td>
            <td className="cart-unit-price">
              <span className="cart-cell-label">Đơn giá</span>
              {formatMoney(item.price)} VNĐ
            </td>
            <td className="cart-quantity-cell">
              <span className="cart-cell-label">Số lượng</span>
              <div className="cart-quantity">
                <DemoButton aria-label={`Giảm số lượng ${item.name}`}>
                  -
                </DemoButton>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  aria-label={`Số lượng ${item.name}`}
                />
                <DemoButton aria-label={`Tăng số lượng ${item.name}`}>
                  +
                </DemoButton>
              </div>
            </td>
            <td className="cart-item-total">
              <span className="cart-cell-label">Thành tiền</span>
              <b>{formatMoney(item.price * item.quantity)} VNĐ</b>
            </td>
            <td className="cart-delete-cell">
              <DemoButton aria-label={`Xóa sản phẩm ${item.name}`}>
                <Icon name="trash" className="cart-icon" />
              </DemoButton>
            </td>
          </tr>
        ))}
        <tr className="cart-total-row">
          <td colSpan={5}>
            <div>
              <b>Tổng tiền:</b>{" "}
              <b className="cart-total-price">{formatMoney(total)} VNĐ</b>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
