import { storeData } from "@/data";
import { Commitment } from "./Commitment";
import { Icon } from "@/components/ui/Icon";
const serviceIcons = ["delivery", "return", "card", "headset"] as const;
export function Support({
  className = "support-block",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <section className="service-section" aria-label="Mua hàng tại TGB SHOP">
        <ul className="service-list">
          {storeData.features.map((f, i) => (
            <li key={i}>
              <Icon name={serviceIcons[i] ?? "headset"} className="service-icon" />
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
