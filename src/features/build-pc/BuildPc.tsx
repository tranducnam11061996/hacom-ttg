import Link from "next/link";
import type { ReactNode } from "react";
import { buildData } from "@/data";
import { FloatingContact } from "@/components/support/FloatingContact";
import { routes } from "@/lib/routes";
import { Configuration } from "./Configuration";
import { BuildPickerProvider } from "./BuildPickerProvider";
export function BuildPc({ support }: { support: ReactNode }) {
  const groups = buildData.groups.map(({ id, name, picker }) => ({ id, name, picker }));
  return <main id="main" className="buildpc-screen">
    <BuildPickerProvider groups={groups}>
      <div className="bp-container">
        <nav className="bp-breadcrumb" aria-label="Đường dẫn">
          <Link prefetch={false} href={routes.home}>Trang chủ</Link>
          <span aria-hidden="true">&gt;</span><span>Xây dựng máy tính - tạo máy tính</span>
        </nav>
        <Configuration groups={buildData.groups} />
        {support}
      </div>
      <FloatingContact />
    </BuildPickerProvider>
  </main>;
}
