import "@/features/home/home.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PC Gaming, PC đồ họa và linh kiện",
  description:
    "Khám phá giao diện demo TTG SHOP với PC Gaming, PC đồ họa, linh kiện máy tính, khuyến mãi và các playlist Thầy Giáo Ba.",
};
import { Home } from "@/features/home/Home";
export default function Page() {
  return <Home />;
}
