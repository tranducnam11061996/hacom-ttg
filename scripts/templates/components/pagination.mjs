import { esc } from '../../html.mjs';
export function pagination({ currentPage, totalPages, getPageHref, demo = false, context = {} }) {
  return `<nav class="listing-pagination" aria-label="Phân trang">${Array.from({length:totalPages},(_,i)=>{const page=i+1;return `<a class="listing-page${page===currentPage?' active':''}" href="${esc(demo?'#':getPageHref(page,context))}" ${page===currentPage?'aria-current="page"':''} ${demo&&page!==currentPage?'data-demo':''}>${page}</a>`;}).join('\n')}</nav>`;
}
