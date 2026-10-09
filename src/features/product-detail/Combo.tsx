import { productData as data } from "@/data";
import { AssetImage } from "@/components/ui/AssetImage";
import { DemoButton } from "@/components/ui/Demo";
import { Icon } from "@/components/ui/Icon";
export function Combo() {
  return (
    <section className="pd-combo" aria-label="Sản phẩm mua kèm">
      <h2>Sản phẩm mua kèm</h2>
      <div className="pd-combo-slider">
        <div className="pd-combo-track">
          {data.comboGroups.map((g, i) => (
            <article key={i} className="pd-combo-card">
              <div className="pd-combo-image">
                <AssetImage image={g.image} alt={g.title} />
                <h3>{g.title}</h3>
              </div>
              <DemoButton>Chọn sản phẩm</DemoButton>
            </article>
          ))}
        </div>
        <DemoButton
          className="pd-arrow pd-prev"
          aria-label="Nhóm mua kèm trước"
        >
          ‹
        </DemoButton>
        <DemoButton
          className="pd-arrow pd-next"
          aria-label="Nhóm mua kèm tiếp theo"
        >
          ›
        </DemoButton>
      </div>
      <div className="pd-combo-summary">
        <div>
          <p>
            Tạm tính: <strong>{data.price.replace(/\s*đ$/, "đ")}</strong>
          </p>
          <p>
            Tiết kiệm: <b>0đ</b>
          </p>
        </div>
        <DemoButton className="pd-combo-buy">
          <Icon name="combo" className="" width="24" height="24" /> Mua combo
        </DemoButton>
      </div>
    </section>
  );
}
