import { esc } from "../../../html.mjs";
import { assetUrl } from "../../utils/assets.mjs";
export function hero(items,assets,context = {}){
 const img=(h,i)=>{const a=assets[h.source];return `<img src="${esc(assetUrl(a.path,context))}" ${a.small?`srcset="${esc(assetUrl(a.small,context))} 800w, ${esc(assetUrl(a.path,context))} ${a.width}w" sizes="(min-width:1620px) 1600px, (min-width:1280px) 1200px, calc(100vw - 24px)"`:''} width="${a.width}" height="${a.height}" alt="${esc(h.alt)}" ${i===0?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;};
 return `<section class="ttg-hero-section" aria-label="Ưu đãi TTG"><div data-hero class="ttg-hero" role="region" aria-roledescription="carousel" aria-label="Banner khuyến mãi" tabindex="0"><div data-hero-track class="ttg-hero-track">${items.slice(0,9).map((h,i)=>`<a href="#" class="ttg-slide" aria-label="Banner ${i+1} trên 9" ${i?'tabindex="-1"':''}>${img(h,i)}</a>`).join('')}</div><button type="button" data-hero-pause class="ttg-hero-pause" aria-pressed="false">Dừng trình chiếu</button></div><div class="ttg-secondary-banners">${items.slice(9).map(h=>`<a href="#">${img(h,-1)}</a>`).join('')}</div></section>`;
}
