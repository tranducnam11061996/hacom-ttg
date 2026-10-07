import { load } from "cheerio";
import { esc } from "../../html.mjs";
import { createImage, clean } from "../utils/assets.mjs";
export function footer({ footerHtml, assets, context = {} }) {
 const image = createImage(assets, context);
 const logo = "./include/logo_ttgshop-logo-27122025-1.png";
const $ = load(footerHtml, null, false);
const footerIcon=(name)=>`<span class="footer-icon footer-icon-${name}" aria-hidden="true"></span>`;
const showrooms = $('.footer-showroom .flex-1').toArray().map(el=>`<section class="showroom-card"><h3 class="showroom-name"><span>${esc($(el).find('h3').text().trim())}</span></h3><ul class="showroom-info">${$(el).find('ul>li').toArray().map((li,i)=>`<li>${footerIcon(['location','phone','email','map'][i])} ${clean($(li).html())}</li>`).join('')}</ul></section>`).join('');
const companies = $('.footer-company .grid > div').toArray().map((el,i)=>{
 const content=$(el).children('p,ul').toArray().map(n=>{
  if(n.name==='p') return clean($(n).prop('outerHTML'));
  return `<ul>${$(n).children('li').toArray().map((li,j)=>{
   if($(li).find('img').length) return `<li class="footer-bct"><a href="#">${image('/static/assets/default/images/ttgshop-bct-1.png','Đã thông báo Bộ Công Thương')}</a></li>`;
   return `<li>${i===1?footerIcon(j<2?'contact-location':j===2?'contact-phone':'contact-email')+' ':''}${clean($(li).html())}</li>`;
  }).join('')}</ul>`;
 }).join('');
 return `<section><h3>${esc($(el).find('h4').text().trim())}</h3>${content}</section>`;
}).join('');
 return `<footer class="ttg-footer"><section class="footer-showroom" aria-labelledby="showroom-title"><div class="ttg-container"><h2 id="showroom-title">HỆ THỐNG SHOWROOM TTG</h2><div class="showroom-grid">${showrooms}</div></div></section><div class="footer-company"><div class="ttg-container"><a href="#" class="footer-logo" aria-label="TTG SHOP">${image(logo,'TTG SHOP')}</a><div class="footer-company-grid">${companies}</div></div></div><div class="footer-copyright">${clean($('.copyright').html())}</div></footer>`;
}
