import "@/styles/store.css";
import type { ReactNode } from "react";
import { storeData, cartData } from "@/data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header
        logo={storeData.logo}
        searchCategories={storeData.searchCategories}
        cartItemsCount={cartData.items.length}
      />
      {children}
      <Footer />
    </>
  );
}
