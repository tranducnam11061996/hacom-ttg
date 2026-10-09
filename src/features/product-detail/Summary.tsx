import { productData as data } from "@/data";
import { DemoButton, DemoLink } from "@/components/ui/Demo";
import { Content } from "@/components/ui/Content";
import { ProductPurchase } from "./ProductPurchase";
export function Summary() {
  return (
    <section className="pd-summary-column">
      <h1 className="pd-title">{data.displayTitle}</h1>
      <div className="pd-price-box">
        <div className="pd-price flex flex-wrap items-center justify-between gap-[10px] text-[20px] leading-[24px] p-[16px] text-white bg-[linear-gradient(90deg,#FF5033_0%,#FF7301_100%)] rounded-[8px] min-[1620px]:p-[20px]">
          <p className="pd-price-sale text-[24px] font-bold min-[1620px]:text-[28px]">
            {data.price.replace(/\s*đ$/, "")} <u>đ</u>
          </p>
          <del className="pd-price-market">{data.market}</del>
          <p
            className="pd-price-discount text-[14px] min-[1620px]:text-[16]"
            style={{ visibility: "visible" }}
          >
            Tiết kiệm: <span>{data.saving}</span>Đ
          </p>
        </div>
        <div className="flex items-center gap-[10px] mt-[12px]">
          <span className="pd-wantary inline-block text-[12px] leading-[28px] px-[9px] bg-[#FFC617] rounded-[4px] min-[1620px]:text-[14px]">
            {data.warranty}
          </span>
          <DemoLink className="pd-call-support">
            <svg height="20" width="20" viewBox="0 -960 960 960" fill="#ffffff">
              <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
            </svg>
            TƯ VẤN NÂNG CẤP
          </DemoLink>
        </div>
      </div>
      <div className="pd-summary">
        <p className="leading-[17px] font-bold mb-[8px]">Mô tả sản phẩm</p>
        <ul className="text-[13px] leading-[20px] min-[1620px]:text-[15px] tracking-tight">
          {data.summary.map((line, i) => (
            <li key={i} className="flex items-start gap-[4px] mb-[2px]">
              <span className="pd-icon pd-icon-check" aria-hidden="true" />
              <span className="flex-1">{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <section className="pd-upgrade">
        <h2>
          <span className="pd-icon pd-icon-config" aria-hidden="true" /> UPGRADE
        </h2>
        <table>
          <tbody>
            {data.upgradeGroups.map((g, i) => (
              <tr key={i}>
                <th scope="row">{g.label}</th>
                <td>
                  {g.options.map((o, j) => (
                    <DemoButton
                      key={j}
                      className={`pd-upgrade-choice${j === g.selectedIndex ? " pd-selected" : ""}`}
                      aria-pressed={j === g.selectedIndex}
                    >
                      {o}
                    </DemoButton>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="pd-offer">
        <Content html={data.fragments.promotion} />
      </section>
      <ProductPurchase />
      <div className="pd-payment">
        <DemoButton className="pd-payment-card">
          <strong>TRẢ GÓP QUA THẺ</strong>
          <span>Visa, Master, JCB</span>
        </DemoButton>
        <DemoButton className="pd-payment-later">
          <strong>MUA NGAY - TRẢ SAU</strong>
        </DemoButton>
      </div>
    </section>
  );
}
