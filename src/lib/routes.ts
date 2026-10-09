export const routes = {
  home: "/",
  catalog: "/pc",
  product: "/pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc",
  cart: "/cart",
  buildPc: "/buildpc",
  videos: "/videos",
};
export const categoryHref = (name: string) =>
  name.trim() ? routes.catalog : "#";
export const playlistHref = (slug: string) =>
  `${routes.videos}/playlist/${slug}`;
