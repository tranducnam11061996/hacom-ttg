import { initProductTooltips } from './product-tooltips.js';

const initialized = new WeakSet();
export function initCategory(doc = document) {
 const screen=doc.querySelector('.listing-screen'); if(!screen||initialized.has(screen)) return;
 initialized.add(screen);
 const toggle=screen.querySelector('[data-description-toggle]'), content=screen.querySelector('.listing-description-content');
 toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expanded));content.classList.toggle('expanded',expanded);toggle.firstChild.textContent=expanded?'Thu gọn':'Xem thêm';});
 let timer; const notice=()=>{const status=doc.querySelector('#demo-status');status.textContent='Đây là giao diện demo. Chức năng lọc, sắp xếp và phân trang chưa được kết nối.';status.hidden=false;clearTimeout(timer);timer=setTimeout(()=>status.hidden=true,4000);};
 screen.querySelectorAll('[data-filter-demo],[data-sort-demo]').forEach(el=>el.addEventListener('change',notice));
 const sidebar=screen.querySelector('.listing-sidebar'), overlay=screen.querySelector('.listing-filter-overlay'), open=screen.querySelector('[data-filter-open]');
 const setOpen=value=>{sidebar.classList.toggle('open',value);overlay.hidden=!value;open.setAttribute('aria-expanded',String(value));doc.body.style.overflow=value?'hidden':'';if(value){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');sidebar.querySelector('button').focus();}else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');open.focus();}};
 open.addEventListener('click',()=>setOpen(true));screen.querySelectorAll('[data-filter-close]').forEach(el=>el.addEventListener('click',()=>setOpen(false)));
 initProductTooltips(screen);
 doc.addEventListener('keydown',e=>{if(e.key==='Escape'){if(sidebar.classList.contains('open'))setOpen(false);}if(e.key==='Tab'&&sidebar.classList.contains('open')){const items=[...sidebar.querySelectorAll('button,a,input')],first=items[0],last=items.at(-1);if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first.focus();}}});
 window.addEventListener('resize',()=>{if(innerWidth>=768&&sidebar.classList.contains('open'))setOpen(false);});
}
