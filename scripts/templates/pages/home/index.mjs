import { esc } from "../../../html.mjs";
import { hero } from "./hero.mjs";
import { homePlaylists } from "./playlists.mjs";
import { saleSection } from "./sale.mjs";
import { categorySection } from "./categories.mjs";
import { serviceBenefits } from "../../components/service-benefits.mjs";
import { commitment } from "../../components/commitment.mjs";
export function homeContent(data, playlists, context = {}) {
 const options = { assets: data.assets, overlays: data.overlays, context };
 return `<h1 class="sr-only">${esc(data.title)}</h1>${hero(data.hero,data.assets,context)}${homePlaylists(playlists,context)}${saleSection(data.collections,options)}<div class="category-group">${data.categories.map((c,i) => categorySection(c,i,options)).join("")}</div><div class="support-block">${serviceBenefits(data.features)}${commitment(data.questions)}</div>`;
}
