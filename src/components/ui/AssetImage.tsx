import type { ImgHTMLAttributes } from "react";

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  small?: string;
}

/** Preserve the supplied image sizes and responsive variants without a remote image service. */
export function AssetImage({
  image,
  alt = "",
  eager = false,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  image: ImageAsset;
  eager?: boolean;
}) {
  return (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={alt}
      srcSet={
        image.small
          ? `${image.small} 800w, ${image.src} ${image.width}w`
          : undefined
      }
      sizes={image.small ? "(max-width: 800px) 100vw, 1220px" : undefined}
      loading={eager ? undefined : "lazy"}
      decoding="async"
      {...props}
    />
  );
}
