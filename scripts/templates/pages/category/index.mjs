import { load } from 'cheerio';
import { esc } from '../../../html.mjs';
import { assetUrl } from '../../utils/paths.mjs';
import { createImage } from '../../utils/assets.mjs';
import { categorySidebar } from '../../components/category-sidebar.mjs';
import { pagination } from '../../components/pagination.mjs';
import { productCard } from '../../components/product-card.mjs';
import { serviceBenefits } from '../../components/service-benefits.mjs';
import { commitment } from '../../components/commitment.mjs';
export function categoryContent({ categoryData:d, storeData, context = {} }) {
 const $=load(d.descriptionHtml,null,false), image=createImage(d.assets,context);
 $('img').each((_,el)=>{const n=$(el),a=d.assets[n.attr('src')];n.attr('src',assetUrl(a.path,context));});
 $('a').attr('href','#').removeAttr('target').removeAttr('rel');
 const options={assets:d.assets,overlays:d.overlays,context,variant:'listing'};
 return `<h1 class="sr-only">${esc(d.title)}</h1><div class="listing-container"><nav class="listing-breadcrumb" aria-label="Đường dẫn"><a href="${esc(assetUrl('index.html',context))}">Trang chủ</a><span aria-hidden="true">›</span><span>${esc(d.title)}</span></nav><section class="listing-description"><div id="listing-description-content" class="listing-description-content">${$.html()}</div><div class="listing-description-action"><button type="button" data-description-toggle aria-expanded="false" aria-controls="listing-description-content">Xem thêm<svg aria-hidden="true" height="16" width="16" viewBox="0 -960 960 960"><path fill="#ff5636" d="M480-192 240-432l51-51 189 189 189-189 51 51-240 240Zm0-285L240-717l51-51 189 189 189-189 51 51-240 240Z"/></svg></button></div></section><div class="listing-main">${categorySidebar({categoryTitle:d.title,categoryLinks:d.categoryLinks,filterGroups:d.filterGroups,context})}<section class="listing-products" aria-label="Danh sách sản phẩm"><div class="listing-toolbar"><p>Tìm thấy <span>${d.totalProducts}</span> sản phẩm</p><button class="listing-filter-open" type="button" data-filter-open aria-controls="listing-sidebar" aria-expanded="false">Lọc sản phẩm</button><select data-sort-demo aria-label="Sắp xếp sản phẩm">${d.sortOptions.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join('')}</select></div><div class="listing-grid">${d.products.map(p=>productCard(p,options)).join('')}</div>${pagination({currentPage:1,totalPages:d.totalPages,getPageHref:p=>p===1?'./':`?page=${p}`,demo:true,context})}</section></div><div class="support-block">${serviceBenefits(storeData.features)}${commitment(storeData.questions)}</div></div><div class="listing-filter-overlay" data-filter-close hidden></div><div class="listing-contact"><button type="button" data-demo aria-label="Messenger">${image(d.messenger,'Messenger')}</button><button type="button" data-demo aria-label="Zalo">${image(d.zalo,'Zalo')}</button></div>`;
}
