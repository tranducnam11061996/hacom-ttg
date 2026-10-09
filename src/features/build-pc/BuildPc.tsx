"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { buildData } from "@/data";
import { FloatingContact } from "@/components/support/FloatingContact";
import { routes } from "@/lib/routes";
import { Configuration } from "./Configuration";
import { Picker } from "./Picker";
export function BuildPc({ support }: { support: ReactNode }) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const group = buildData.groups.find((g) => g.id === groupId);
  return (
    <main id="main" className="buildpc-screen">
      <div className="bp-container">
        <nav className="bp-breadcrumb" aria-label="Đường dẫn">
          <Link prefetch={false} href={routes.home}>
            Trang chủ
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>Xây dựng máy tính - tạo máy tính</span>
        </nav>
        <Configuration onChoose={setGroupId} />
        {support}
      </div>
      {group && (
        <Picker key={group.id} group={group} onClose={() => setGroupId(null)} />
      )}
      <FloatingContact />
    </main>
  );
}
