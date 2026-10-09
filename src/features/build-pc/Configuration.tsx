"use client";
import { memo } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";

import { buildData } from "@/data";
import { DemoButton } from "@/components/ui/Demo";
import { AssetImage } from "@/components/ui/AssetImage";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/format";
import type { SelectedComponent } from "./types";

function SelectedItem({
  item,
  groupId,
  onChoose,
}: {
  item: SelectedComponent;
  groupId: string;
  onChoose: (id: string) => void;
}) {
  return (
    <article className="bp-item" data-build-item={item.id}>
      <Link prefetch={false} href={routes.product} className="bp-image">
        <AssetImage image={item.image} alt={item.name} eager />
      </Link>
      <div className="bp-item-text">
        <div className="bp-item-left">
          <Link prefetch={false} href={routes.product} className="bp-item-name">
            {item.name}
          </Link>
          <p>
            - Kho hàng:{" "}
            <b className={item.stock === "Hết hàng" ? "bp-empty" : "bp-stock"}>
              {item.stock}
            </b>
          </p>
          {item.warranty && (
            <p>
              - Bảo hành: <b className="bp-warranty">{item.warranty}</b>
            </p>
          )}
        </div>
        <div className="bp-item-right">
          <div className="bp-equation">
            <b>{formatMoney(item.price)} VNĐ</b>
            <span className="bp-multiply">x</span>
            <span className="bp-quantity">
              <DemoButton aria-label={`Giảm số lượng ${item.name}`}>
                −
              </DemoButton>
              <input
                value={item.quantity}
                readOnly
                aria-label={`Số lượng ${item.name}`}
              />
              <DemoButton aria-label={`Tăng số lượng ${item.name}`}>
                +
              </DemoButton>
            </span>
            <span className="bp-equals">=</span>
            <b className="bp-price">
              {formatMoney(item.price * item.quantity)} VNĐ
            </b>
          </div>
          <div className="bp-item-actions">
            <button
              type="button"
              data-picker-open={groupId}
              aria-haspopup="dialog"
              aria-controls="component-picker"
              aria-label={`Thay đổi ${item.name}`}
              onClick={() => onChoose(groupId)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="m17 2 5 5-12 12-6 1 1-6zm-1 4L7 15l-1 3 3-1 9-9z" />
              </svg>
            </button>
            <DemoButton aria-label={`Xóa ${item.name}`}>
              <Icon name="trash" className="cart-icon" />
            </DemoButton>
          </div>
        </div>
      </div>
    </article>
  );
}
export const Configuration = memo(function Configuration({
  onChoose,
}: {
  onChoose: (id: string) => void;
}) {
  const total = buildData.groups.reduce(
    (n, g) => n + g.items.reduce((v, p) => v + p.price * p.quantity, 0),
    0,
  );
  const summary = (
    <p className="bp-summary">
      <span className="bp-summary-label">Chi phí dự tính:</span>{" "}
      <span data-build-total="">{formatMoney(total)} đ</span>
    </p>
  );
  return (
    <div className="bp-panel">
      <h1>Chọn linh kiện xây dựng cấu hình</h1>
      <div className="bp-top-actions">
        <DemoButton className="bp-reset">
          Làm mới <span aria-hidden="true">↶</span>
        </DemoButton>
        {summary}
      </div>
      <div className="bp-groups">
        {buildData.groups.map((group, index) => (
          <section
            className="bp-group"
            data-build-group={group.id}
            key={group.id}
          >
            <h2>
              {index + 1}. {group.name}
            </h2>
            <div className="bp-group-content">
              {group.items.map((item) => (
                <SelectedItem
                  key={item.id}
                  item={item}
                  groupId={group.id}
                  onChoose={onChoose}
                />
              ))}
              {(!group.items.length || group.multiple) && (
                <div className="bp-choose-row">
                  <button
                    type="button"
                    data-picker-open={group.id}
                    aria-haspopup="dialog"
                    aria-controls="component-picker"
                    onClick={() => onChoose(group.id)}
                  >
                    + {group.items.length ? "Chọn Thêm" : `Chọn ${group.name}`}
                  </button>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
      {summary}
      <div className="bp-actions">
        {[
          { label: "Tải ảnh cấu hình", symbol: "▧" },
          { label: "Tải file Excel cấu hình", icon: "excel" as const },
          { label: "Xem & In", icon: "print" as const },
          { label: "Thêm vào giỏ hàng", symbol: "+" },
        ].map((a, i) => (
          <DemoButton key={i} className={i === 3 ? "bp-red" : undefined}>
            {a.label}{" "}
            {a.icon ? (
              <Icon name={a.icon} className="cart-icon" />
            ) : (
              <span aria-hidden="true">{a.symbol}</span>
            )}
          </DemoButton>
        ))}
      </div>
    </div>
  );
});
