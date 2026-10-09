import { productData } from "@/data";
import { AssetImage, type ImageAsset } from "@/components/ui/AssetImage";
import { DemoButton } from "@/components/ui/Demo";
export function FloatingContact({
  contacts = productData.contacts,
  listing = false,
}: {
  contacts?: { messenger: ImageAsset; zalo: ImageAsset };
  listing?: boolean;
}) {
  const content = (
    <>
      <DemoButton aria-label="Messenger">
        <AssetImage image={contacts.messenger} alt="Messenger" />
      </DemoButton>
      <DemoButton aria-label="Zalo">
        <AssetImage image={contacts.zalo} alt="Zalo" />
      </DemoButton>
    </>
  );
  return listing ? (
    <div className="listing-contact">{content}</div>
  ) : (
    <aside
      className="floating-contact pd-contact"
      aria-label="Liên hệ TTG SHOP"
    >
      {content}
    </aside>
  );
}
