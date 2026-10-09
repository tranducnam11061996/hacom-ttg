import "@/features/build-pc/build-pc.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Xây dựng cấu hình PC",
  description:
    "Thử giao diện xây dựng cấu hình PC tại TTG SHOP: xem các nhóm linh kiện, mở danh sách lựa chọn và tham khảo cấu hình mẫu.",
};
import { Support } from "@/components/support/Support";
import { BuildPc } from "@/features/build-pc/BuildPc";
export default function Page() {
  return <BuildPc support={<Support className="bp-support support-block" />} />;
}
