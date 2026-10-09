import type { ReactNode } from "react";
import { VideoNavigation } from "@/features/videos/VideoNavigation";
export default function VideoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <VideoNavigation />
      {children}
    </>
  );
}
