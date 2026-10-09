import { storeData } from "@/data";
import { Commitment } from "./Commitment";
export function Support({
  className = "support-block",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <section className="service-section" aria-label="Mua hàng tại TTG SHOP">
        <ul className="service-list">
          {storeData.features.map((f, i) => (
            <li key={i}>
              <span
                className={`service-icon service-icon-${i + 1}`}
                aria-hidden="true"
              />
              <p className="service-title">{f.title}</p>
              <p className="service-description">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <Commitment questions={storeData.questions} />
    </div>
  );
}
