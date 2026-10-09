import { productData as data } from "@/data";
import { AssetImage } from "@/components/ui/AssetImage";
import { DemoButton } from "@/components/ui/Demo";
export function Gallery() {
  return (
    <section className="pd-gallery" aria-label="Hình ảnh sản phẩm">
      <div className="pd-gallery-main">
        <DemoButton
          className="pd-gallery-picture"
          aria-label={`Phóng to ảnh — ${data.title}`}
        >
          <AssetImage
            image={data.gallery[0].image}
            alt={data.title}
            eager
            fetchPriority="high"
          />
        </DemoButton>
        <AssetImage
          image={data.overlays.delta}
          className="pd-gallery-overlay"
          eager
          fetchPriority={undefined}
        />
        <DemoButton className="pd-arrow pd-prev" aria-label="Ảnh trước">
          ‹
        </DemoButton>
        <DemoButton className="pd-arrow pd-next" aria-label="Ảnh tiếp theo">
          ›
        </DemoButton>
      </div>
      <div className="pd-thumbnails">
        {data.gallery.map((g, i) => (
          <DemoButton
            key={i}
            className={`pd-thumbnail${i === 0 ? " pd-selected" : ""}`}
            aria-label={`Ảnh ${i + 1} — ${data.title}`}
          >
            <span>
              <AssetImage
                image={g.thumbnail}
                alt={data.title}
                width="100"
                height="100"
              />
            </span>
          </DemoButton>
        ))}
      </div>
    </section>
  );
}
