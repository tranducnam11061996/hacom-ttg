import type { ImageAsset } from "@/components/ui/AssetImage";
import type { Product } from "@/components/product/ProductCard";

export type Banner = { alt: string; image: ImageAsset };
export type SaleCollection = { id: string; products: Product[] };
