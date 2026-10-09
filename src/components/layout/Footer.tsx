import { Fragment } from "react";
import footerData from "@/data/footer.json";
import { DemoLink } from "@/components/ui/Demo";
import { AssetImage } from "@/components/ui/AssetImage";

function InlineText({ parts }: { parts: { text: string; link: boolean }[] }) {
  return parts.map((part, i) =>
    part.link ? (
      <DemoLink key={i}>{part.text}</DemoLink>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    ),
  );
}

export function Footer() {
  return (
    <footer className="ttg-footer">
      <section className="footer-showroom" aria-labelledby="showroom-title">
        <div className="ttg-container">
          <h2 id="showroom-title">HỆ THỐNG SHOWROOM TTG</h2>
          <div className="showroom-grid">
            {footerData.showrooms.map((s, i) => (
              <section className="showroom-card" key={i}>
                <h3 className="showroom-name">
                  <span>{s.name}</span>
                </h3>
                <ul className="showroom-info">
                  {s.lines.map((line, j) => (
                    <li key={j}>
                      <span
                        className={`footer-icon ${line.icon}`}
                        aria-hidden="true"
                      />
                      <InlineText parts={line.parts} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
      <div className="footer-company">
        <div className="ttg-container">
          <DemoLink className="footer-logo" aria-label="TTG SHOP">
            <AssetImage image={footerData.logo} alt="TTG SHOP" />
          </DemoLink>
          <div className="footer-company-grid">
            {footerData.companies.map((company, i) => (
              <section key={i}>
                <h2 className="footer-company-title">{company.title}</h2>
                {company.blocks.map((block, j) =>
                  block.paragraph ? (
                    <p key={j}>{block.paragraph}</p>
                  ) : (
                    <ul key={j}>
                      {block.items.map((item, k) => (
                        <li
                          key={k}
                          className={item.image ? "footer-bct" : undefined}
                        >
                          {item.icon && (
                            <>
                              <span
                                className={`footer-icon ${item.icon}`}
                                aria-hidden="true"
                              />{" "}
                            </>
                          )}
                          {item.image ? (
                            <DemoLink>
                              <AssetImage
                                image={item.image}
                                alt="Đã thông báo Bộ Công Thương"
                              />
                            </DemoLink>
                          ) : (
                            <InlineText parts={item.parts} />
                          )}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        {footerData.copyright.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </div>
    </footer>
  );
}
