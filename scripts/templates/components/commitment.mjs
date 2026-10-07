import { esc } from "../../html.mjs";
import { clean } from "../utils/assets.mjs";
export function commitment(questions) {
 return `<section class="commitment-section" aria-labelledby="faq-title"><h2 id="faq-title" class="commitment-heading">Trải nghiệm mua sắm tại <span class="text-primary">TTG SHOP</span><br><span class="commitment-large">Cam Kết 100% <span class="commitment-gradient">Hài Lòng</span></span></h2><div class="commitment-list"><ol>${questions.map((q,i)=>`<li data-commitment><h3><button type="button" data-commitment-toggle id="commitment-button-${i}" aria-expanded="false" aria-controls="commitment-panel-${i}"><span>${esc(q.title)}</span><span class="commitment-plus" aria-hidden="true"></span></button></h3><div data-commitment-panel id="commitment-panel-${i}" aria-labelledby="commitment-button-${i}" hidden inert><div class="commitment-content">${clean(q.html)}</div></div></li>`).join('')}</ol></div></section>`;
}
