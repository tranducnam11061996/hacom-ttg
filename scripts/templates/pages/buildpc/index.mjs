import {assetUrl} from '../../utils/paths.mjs';
import {buildConfiguration} from '../../components/buildpc/configuration.mjs';
import {componentPicker} from '../../components/buildpc/picker.mjs';
import {serviceBenefits} from '../../components/service-benefits.mjs';
import {commitment} from '../../components/commitment.mjs';
import {floatingContact} from '../../components/floating-contact.mjs';
export function buildpcContent({buildData,storeData,contactData,context={}}) {
 return `<div class="bp-container"><nav class="bp-breadcrumb" aria-label="Đường dẫn"><a href="${assetUrl('index.html',context)}">Trang chủ</a><span aria-hidden="true">&gt;</span><span>Xây dựng máy tính - tạo máy tính</span></nav>${buildConfiguration({...buildData,context})}<div class="bp-support support-block">${serviceBenefits(storeData.features)}${commitment(storeData.questions)}</div></div>${componentPicker({...buildData,context})}${floatingContact({...contactData,context})}`;
}
