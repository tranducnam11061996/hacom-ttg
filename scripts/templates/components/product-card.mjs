import { esc, icon } from "../../html.mjs";
import { createImage } from "../utils/assets.mjs";
import { load } from 'cheerio';
import { productHref } from '../utils/paths.mjs';
export function productCard(p, { assets, overlays = {}, context = {}, variant = 'default', href = productHref(p, context) }) {
  const image = createImage(assets, context);
  if (variant === 'listing') {
    const $=load(p.tooltipHtml || '',null,false);
    $('script,style,img').remove();
    $('*').each((_,el)=>{for(const key of Object.keys(el.attribs||{})) if(key.startsWith('on')||['href','src','id','tabindex'].includes(key)) $(el).removeAttr(key);});
    $('i').each((_,el)=>{const n=$(el),type=n.hasClass('icon-check-list-1')?'check':n.hasClass('icon-gift-2')?'gift':'';if(type)n.replaceWith(`<span class="listing-tip-icon listing-tip-${type}" aria-hidden="true"></span>`);else n.remove();});
    const tooltipId='product-tooltip-'+p.image.replace(/\W/g,'');
    return `<article data-product class="category-card listing-card"><a href="${esc(href)}" class="category-image" data-product-hover aria-describedby="${esc(tooltipId)}">${image(p.image,p.name,'listing-picture')}${p.overlay&&overlays[p.overlay]?image(overlays[p.overlay],'','listing-overlay'):''}</a><h3 class="category-name"><a href="${esc(href)}" title="${esc(p.name)}">${esc(p.name)}</a></h3><div class="category-prices"><div class="category-price-stack"><p class="category-price">${esc(p.price)}</p>${p.market?`<del class="category-market">${esc(p.market)}</del>`:''}</div>${p.discount?`<span class="category-discount">${esc(p.discount)}</span>`:''}</div><div class="category-bottom"><button type="button" data-demo class="category-buy" aria-label="${esc(p.buy+' — '+p.name)}"><span class="category-buy-inner"><span class="category-cart">${icon('cart')}</span><span>${esc(p.buy)}</span></span></button><span class="category-stock">${esc(p.status)}</span></div><div class="listing-tooltip" id="${esc(tooltipId)}" role="tooltip" hidden>${$.html()}</div></article>`;
  }
  return `<article data-product class="category-card"><a href="${esc(href)}" class="category-image">${image(p.image, p.name, "size-full object-contain")}${p.overlay && overlays[p.overlay] ? image(overlays[p.overlay], "", "absolute inset-x-0 bottom-0 h-2/5 w-full object-contain object-bottom") : ""}</a><h3 class="category-name"><a href="${esc(href)}" title="${esc(p.name)}">${esc(p.name)}</a></h3><div class="category-prices"><div class="category-price-stack"><p class="category-price">${esc(p.price)}</p><del class="category-market">${esc(p.market)}</del></div>${p.discount ? `<span class="category-discount">${esc(p.discount)}</span>` : ""}</div><div class="category-bottom"><button type="button" data-demo class="category-buy" aria-label="${esc(p.buy + " — " + p.name)}"><span class="category-buy-inner"><span class="category-cart">${icon("cart")}</span><span>${esc(p.buy)}</span></span></button><span class="category-stock ${/hết|liên hệ/i.test(p.status) ? "category-stock-empty" : ""}">${esc(p.status)}</span></div></article>`;
}
