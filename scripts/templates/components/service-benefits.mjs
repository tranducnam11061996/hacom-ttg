import { esc } from "../../html.mjs";
export function serviceBenefits(features) {
 return `<section class="service-section" aria-label="Mua hàng tại TTG SHOP"><ul class="service-list">${features.map((f,i)=>`<li><span class="service-icon service-icon-${i+1}" aria-hidden="true"></span><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join('')}</ul></section>`;
}
